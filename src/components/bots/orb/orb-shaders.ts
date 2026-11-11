// GLSL da Orb. Tudo roda sob WebGLRenderer (ShaderMaterial → GLSL ES 3.00).
// As cores saem lineares e em HDR; tone mapping e sRGB acontecem uma vez, no
// passe final (FINAL_FRAGMENT).

const PALETTE = /* glsl */ `
const vec3 cHot = vec3(0.82, 0.92, 1.0);
const vec3 cCyan = vec3(0.22, 0.72, 1.0);
const vec3 cBlue = vec3(0.05, 0.2, 1.0);
const vec3 cViolet = vec3(0.46, 0.14, 1.0);
const vec3 cDeep = vec3(0.002, 0.004, 0.022);
`;

// Reflexo de um painel de luz retangular (softbox), como em fotografia de
// produto: é o que faz a esfera ler como vidro polido e não como plástico.
const SOFTBOX = /* glsl */ `
float softbox(vec3 rf, vec3 L, vec2 size, float soft) {
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), L));
  vec3 up = cross(L, right);
  vec2 d = abs(vec2(dot(rf, right), dot(rf, up))) - size;
  float sd = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - 0.035;
  return smoothstep(0.0, 0.25, dot(rf, L)) * smoothstep(soft, -soft, sd);
}
`;

// Simplex 3D (Ian McEwan / Ashima Arts, MIT): usado só por vértice.
const SIMPLEX_NOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

// ───────────────────────── Corpo: vidro + volume interno ─────────────────────

// A superfície é deformada por ruído de baixa frequência (o contorno ondula,
// não amassa) e por ondas concêntricas que saem do polo voltado para a câmera.
// A normal é recalculada a partir de dois vizinhos, para que reflexos e
// refração acompanhem a deformação.
export const BODY_VERTEX = /* glsl */ `
uniform float uFlow;
uniform float uDisplace;
uniform float uDispFreq;
uniform float uRipple;
uniform float uRipplePhase;
varying vec3 vPos;
varying vec3 vNrm;
varying vec3 vCam;
${SIMPLEX_NOISE}

float surface(vec3 d) {
  vec3 q = d * uDispFreq;
  float n = snoise(q + vec3(0.0, uFlow * 0.31, uFlow * 0.17));
  n += 0.1 * snoise(q * 2.1 + vec3(uFlow * 0.27, 7.3, -uFlow * 0.21));
  float a = acos(clamp(d.z, -1.0, 1.0));
  float rip = sin(a * 12.0 - uRipplePhase) * smoothstep(2.6, 0.2, a);
  return n * uDisplace + rip * uRipple;
}

void main() {
  vec3 d = normalize(position);
  vec3 up = abs(d.y) > 0.95 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 t1 = normalize(cross(up, d));
  vec3 t2 = cross(d, t1);
  const float e = 0.04;
  vec3 p = d * (1.0 + surface(d));
  vec3 d1 = normalize(d + t1 * e);
  vec3 d2 = normalize(d + t2 * e);
  vec3 p1 = d1 * (1.0 + surface(d1));
  vec3 p2 = d2 * (1.0 + surface(d2));
  vec3 n = normalize(cross(p1 - p, p2 - p));
  if (dot(n, d) < 0.0) n = -n;

  vPos = p;
  vNrm = n;
  vCam = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

// Cada pixel refrata o raio de visão ao entrar no vidro e percorre o interior
// da esfera somando luz. É isso que dá profundidade real (paralaxe) em vez de
// uma textura pintada na superfície. Quatro tipos de contribuição:
//  - fios de plasma: raymarch com ruído vindo de uma textura 3D (barato);
//  - núcleo: integral fechada de uma gaussiana ao longo do raio, sem ruído de
//    amostragem;
//  - coroa: raios que saem do núcleo e anéis de pulso que viajam para fora
//    (fala) ou para dentro (escuta);
//  - membrana interna: interseção analítica com uma esfera menor, uma segunda
//    camada de vidro com a borda acesa.
export const BODY_FRAGMENT = /* glsl */ `
uniform highp sampler3D uNoise;
uniform float uT;
uniform float uFlow;
uniform float uIntensity;
uniform float uCore;
uniform float uTurb;
uniform float uViolet;
uniform float uSurge;
uniform float uAudio;
uniform float uSteps;
uniform float uRim;
uniform float uRing;
uniform float uRingPhase;
uniform vec3 uLightA;
uniform vec3 uLightB;
varying vec3 vPos;
varying vec3 vNrm;
varying vec3 vCam;
${PALETTE}
${SOFTBOX}

// quatro ruídos de valor independentes em uma única leitura de textura
vec4 noise4(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return texture(uNoise, (i + f + 0.5) / 32.0);
}

float ign(vec2 p) {
  return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
}

void main() {
  vec3 n = normalize(vNrm);
  vec3 vd = normalize(vPos - vCam);
  float ndv = clamp(dot(n, -vd), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 5.0);

  vec3 rd = refract(vd, n, 0.72);
  if (dot(rd, rd) < 0.01) rd = vd;

  float R = length(vPos);
  float bq = dot(vPos, rd);
  float tMax = max(-2.0 * bq, 0.02);
  vec3 flow = vec3(0.13, 0.31, -0.19) * uFlow;

  // ── fios de plasma
  float dt = tMax / uSteps;
  // o deslocamento inicial muda a cada quadro: em vez de um padrão fixo de
  // hachuras, o olho soma os quadros e enxerga um volume liso
  float t = dt * ign(gl_FragCoord.xy + 5.588238 * mod(floor(uT * 60.0), 64.0));
  vec3 acc = vec3(0.0);
  float trans = 1.0;
  for (int i = 0; i < 40; i++) {
    if (float(i) >= uSteps) break;
    vec3 p = vPos + rd * t;
    float r = length(p) / R;

    // torção estática por raio + rotação lenta: um vórtice que não "enrola"
    float ang = r * 1.8 * (0.6 + uTurb) + uFlow * 0.2;
    float ca = cos(ang), sa = sin(ang);
    vec3 q = vec3(ca * p.x - sa * p.z, p.y, sa * p.x + ca * p.z);

    vec4 warp = noise4(q * 1.5 + flow);
    vec3 qq = q * (1.9 + uTurb * 1.1) + (warp.rgb - 0.5) * 1.8 - flow * 1.3;
    vec4 b = noise4(qq);
    vec4 d = noise4(qq * 2.4 + 7.1);

    // Uma superfície de nível é uma lâmina; a interseção de duas é um fio.
    // Os fios deixam vãos escuros entre si, e é isso que dá profundidade.
    // (O ruído de valor se concentra perto de 0.5, então a faixa em torno do
    // nível precisa ser estreita, senão o volume inteiro vira névoa.)
    float r1 = clamp(1.0 - abs(b.r - 0.5) * 7.5, 0.0, 1.0);
    float r2 = clamp(1.0 - abs(b.g - 0.5) * 7.5, 0.0, 1.0);
    float thread = r1 * r2;
    thread *= thread;
    float sheet = r1 * r1 * smoothstep(0.55, 0.8, warp.a);
    float detail = 0.45 + pow(1.0 - abs(2.0 * d.r - 1.0), 2.0);
    float veins = (thread + sheet * 0.07) * detail;

    float env = smoothstep(1.0, 0.4, r);
    float spark = pow(d.g, 18.0) * smoothstep(0.55, 0.9, b.b);

    vec3 cVein = mix(cBlue, cViolet, clamp(uViolet * 0.85 + r * 0.45 - 0.15, 0.0, 1.0));
    cVein = mix(cCyan, cVein, smoothstep(0.1, 0.55, r));
    cVein = mix(cVein, cHot, thread * 0.35);

    vec3 e = cVein * veins * env * (9.0 + uTurb * 3.5) + cHot * spark * env * 10.0;
    acc += trans * e * dt;
    trans *= exp(-veins * env * 3.0 * dt);
    t += dt;
  }

  // ── núcleo: ∫ exp(-k·r²) dt ao longo do raio = exp(-k·h²)·√(π/k)
  vec3 pc = vPos - rd * bq; // ponto do raio mais próximo do centro
  float h2 = dot(pc, pc) / (R * R);
  float h = sqrt(h2);
  float kc = 44.0 - uCore * 5.0;
  float plasma = 0.85 + 0.3 * noise4(pc * 3.0 + flow * 3.0).r;
  vec3 inner = cHot * exp(-h2 * kc) * sqrt(3.14159 / kc) * plasma
             * (5.6 + uCore * 1.5 + uSurge * 1.5 + uAudio * 1.6);
  inner += mix(cCyan, cBlue, 0.6) * exp(-h2 * 6.0) * (0.03 + uCore * 0.05);

  // ── coroa: ruído constante ao longo do raio da esfera, visto do núcleo
  vec3 dirc = normalize(pc + 1e-4);
  float rayA = noise4(dirc * 2.8 + flow * 0.7).g;
  float rayB = noise4(dirc * 6.5 - flow * 1.1).b;
  float rays = pow(rayA, 2.5) * (0.5 + rayB) * 2.2;
  inner += mix(cCyan, cViolet, uViolet * 0.85) * rays * exp(-h * 5.2)
         * (0.9 + uCore * 0.4 + uSurge * 0.8);

  // ── anéis de pulso
  float ring = pow(0.5 + 0.5 * sin(h * 30.0 - uRingPhase), 10.0);
  inner += mix(cCyan, cHot, 0.35) * ring * exp(-h * 4.2) * smoothstep(0.06, 0.2, h)
         * uRing * (0.25 + uAudio * 0.7 + uSurge * 0.3);

  // ── membrana interna
  float rm = 0.64 * R;
  float disc = bq * bq - (dot(vPos, vPos) - rm * rm);
  vec3 membrane = vec3(0.0);
  if (disc > 0.0) {
    float sq = sqrt(disc);
    for (int k = 0; k < 2; k++) {
      vec3 pm = vPos + rd * (-bq + (k == 0 ? -sq : sq));
      float limb = pow(1.0 - abs(dot(pm / rm, rd)), 4.0);
      float pat = smoothstep(0.3, 0.8, noise4(pm * 3.0 + flow * 1.5).b);
      membrane += mix(cViolet, cCyan, pat) * limb * (0.1 + 0.2 * pat);
    }
  }

  // o vidro absorve mais luz perto da borda: a esfera ganha volume
  float depth = mix(0.3, 1.0, pow(ndv, 0.7));
  vec3 col = (acc + inner * mix(1.0, trans, 0.6) + membrane) * uIntensity * depth;
  col += cDeep * (0.4 + 0.6 * trans);

  // ── reflexos: painel de luz frio (segue o cursor) e uma luz violeta em órbita
  vec3 rf = reflect(vd, n);
  float k1 = max(dot(rf, uLightA), 0.0);
  float k2 = max(dot(rf, uLightB), 0.0);
  col += vec3(0.78, 0.9, 1.0) * (softbox(rf, uLightA, vec2(0.12, 0.2), 0.1) * 0.7 + pow(k1, 9.0) * 0.045);
  col += vec3(0.55, 0.4, 1.0) * (pow(k2, 70.0) * 0.9 + pow(k2, 6.0) * 0.05);
  col += mix(vec3(0.2, 0.1, 0.55), vec3(0.1, 0.4, 1.0), rf.y * 0.5 + 0.5) * (0.012 + fres * 0.1);

  // fresnel com variação de película fina, só em tons frios
  float film = ndv * 3.0 + noise4(n * 2.5 + uFlow * 0.3).a * 1.2 + uT * 0.04;
  vec3 rim = mix(cCyan, cViolet, 0.5 + 0.5 * sin(film * 3.0 + uViolet * 2.0));
  col += rim * fres * uRim * (1.5 + uAudio * 0.9 + uSurge * 0.6);

  gl_FragColor = vec4(clamp(col, 0.0, 60.0), 1.0);
}
`;

// ───────────────────────── Casca externa de vidro ────────────────────────────

// Uma segunda esfera transparente, um pouco maior, envolve o corpo: tem o
// próprio reflexo do painel de luz e uma linha fina na silhueta. O vão escuro
// entre as duas camadas é o que comunica espessura.
export const SHELL_VERTEX = /* glsl */ `
varying vec3 vPos;
varying vec3 vCam;
void main() {
  vPos = position;
  vCam = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const SHELL_FRAGMENT = /* glsl */ `
uniform float uT;
uniform float uShell;
uniform float uViolet;
uniform vec3 uLightA;
varying vec3 vPos;
varying vec3 vCam;
${PALETTE}
${SOFTBOX}
void main() {
  vec3 n = normalize(vPos);
  vec3 vd = normalize(vPos - vCam);
  float ndv = clamp(dot(n, -vd), 0.0, 1.0);
  float line = pow(1.0 - ndv, 9.0);
  float sheen = pow(1.0 - ndv, 3.0) * 0.07;
  vec3 c = mix(cCyan, cViolet, clamp(0.3 + 0.35 * sin(atan(n.y, n.x) * 2.0 + uT * 0.15) + uViolet * 0.35, 0.0, 1.0));
  vec3 col = c * (line * 1.2 + sheen) * uShell;
  col += vec3(0.8, 0.9, 1.0) * softbox(reflect(vd, n), uLightA, vec2(0.12, 0.2), 0.07) * 0.2 * uShell;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

// ───────────────────────── Aura ──────────────────────────────────────────────

// Um plano atrás da esfera com um brilho radial suave: ancora a Orb no espaço
// mesmo quando nada está forte o bastante para acender o bloom.
export const AURA_VERTEX = /* glsl */ `
varying vec2 vUv2;
void main() {
  vUv2 = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const AURA_FRAGMENT = /* glsl */ `
uniform float uAura;
uniform float uViolet;
varying vec2 vUv2;
${PALETTE}
void main() {
  float r = length(vUv2 - 0.5) * 2.0;
  float g = exp(-r * r * 7.0) * 0.55 + exp(-r * r * 22.0) * 0.5;
  g *= smoothstep(1.0, 0.6, r);
  vec3 c = mix(mix(cBlue, cCyan, 0.25), cViolet, uViolet * 0.75);
  gl_FragColor = vec4(max(c * g * uAura, 0.0), 1.0);
}
`;

// ───────────────────────── Filamentos ────────────────────────────────────────

// Cada instância é uma fita cujo vértice calcula a própria posição ao longo de
// uma órbita inclinada e ondulada. A "cabeça" avança com uSpin e o resto é o
// rastro. A fita é aberta no espaço da câmera para ter sempre a mesma espessura.
export const FILAMENT_VERTEX = /* glsl */ `
attribute vec4 aQuat;
attribute vec4 aA; // fase, velocidade, raio, espessura
attribute vec4 aB; // amplitude da ondulação, frequência, arco, matiz
uniform float uSpin;
uniform float uT;
uniform float uArc;
uniform float uTight;
varying vec2 vUv2;
varying float vHue;

vec3 qrot(vec3 v, vec4 q) {
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

vec3 curve(float th) {
  float r = aA.z * (1.0 - uTight * 0.1) + aB.x * sin(th * aB.y + aA.x * 5.0 + uT * 0.4);
  vec3 p = vec3(cos(th) * r, aB.x * 1.6 * sin(th * 2.0 + aA.x * 3.0 + uT * 0.27), sin(th) * r);
  return qrot(p, aQuat);
}

void main() {
  float u = uv.x;
  float th = aA.x * 6.2831 + uSpin * aA.y - u * aB.z * uArc;
  vec4 mv = modelViewMatrix * vec4(curve(th), 1.0);
  vec4 mvn = modelViewMatrix * vec4(curve(th + 0.02), 1.0);
  vec3 side = cross(mvn.xyz - mv.xyz, mv.xyz);
  float sl = length(side);
  side = sl > 1e-6 ? side / sl : vec3(0.0, 1.0, 0.0);
  // grossa logo atrás da cabeça, afinando até sumir na cauda
  float taper = pow(1.0 - u, 0.7) * smoothstep(0.0, 0.025, u);
  mv.xyz += side * (uv.y - 0.5) * aA.w * (0.18 + 0.82 * taper);
  vUv2 = uv;
  vHue = aB.w;
  gl_Position = projectionMatrix * mv;
}
`;

export const FILAMENT_FRAGMENT = /* glsl */ `
uniform float uSpin;
uniform float uFilGlow;
uniform float uViolet;
varying vec2 vUv2;
varying float vHue;
${PALETTE}
void main() {
  // com MSAA os varyings podem sair um pouco de 0–1; pow() de base negativa
  // vira NaN e o bloom espalharia isso pela imagem toda
  float a = clamp(1.0 - abs(vUv2.y * 2.0 - 1.0), 0.0, 1.0);
  float line = pow(a, 5.0) + pow(a, 1.5) * 0.2;
  float u = clamp(vUv2.x, 0.0, 1.0);
  float along = exp(-u * 9.0) * 3.4 + pow(1.0 - u, 2.0) * 0.6;
  float pulse = 0.72 + 0.28 * sin(u * 34.0 - uSpin * 6.0 + vHue * 20.0);
  vec3 c = mix(cCyan, cViolet, clamp(vHue * 0.9 + u * 0.5 + uViolet * 0.3 - 0.15, 0.0, 1.0));
  c = mix(c, cHot, exp(-u * 12.0));
  gl_FragColor = vec4(max(c * line * along * pulse * uFilGlow, 0.0), 1.0);
}
`;

// ───────────────────────── Partículas ────────────────────────────────────────

// Toda a simulação é uma função das sementes e de duas fases acumuladas, então
// roda inteira na GPU: cada partícula orbita em um plano próprio, mais rápido
// quanto mais perto da esfera.
export const PARTICLE_VERTEX = /* glsl */ `
attribute vec4 aS1;
attribute vec4 aS2;
uniform float uOrbit;
uniform float uT;
uniform float uTight;
uniform float uSize;
varying float vAlpha;
varying float vHue;
void main() {
  float z = aS1.x * 2.0 - 1.0;
  float ph = aS1.y * 6.2831;
  float sr = sqrt(max(1.0 - z * z, 0.0));
  vec3 ax = vec3(sr * cos(ph), z, sr * sin(ph));
  vec3 b = normalize(cross(ax, abs(ax.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  vec3 c = cross(ax, b);

  float rad0 = mix(1.2, 2.35, pow(aS1.z, 1.5));
  float rad = mix(rad0, 1.14 + (rad0 - 1.14) * 0.55, uTight);
  float ang = aS1.w * 6.2831 + uOrbit * (0.25 + 0.75 * aS2.x) * 2.0 / (rad0 * rad0);
  vec3 p = (b * cos(ang) + c * sin(ang)) * rad;
  p += vec3(sin(uT * 0.37 + aS2.y * 31.0), cos(uT * 0.29 + aS2.z * 47.0), sin(uT * 0.43 + aS2.w * 23.0)) * 0.05;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float twinkle = 0.5 + 0.5 * sin(uT * (0.8 + 2.4 * aS2.y) + aS2.z * 40.0);
  gl_PointSize = uSize * mix(0.55, 2.3, pow(aS2.w, 3.0)) * (7.0 / -mv.z);
  vAlpha = twinkle * smoothstep(2.4, 1.6, rad0) * (0.3 + 0.7 * aS2.x);
  vHue = aS2.z;
  gl_Position = projectionMatrix * mv;
}
`;

export const PARTICLE_FRAGMENT = /* glsl */ `
uniform float uPartGlow;
uniform float uViolet;
varying float vAlpha;
varying float vHue;
${PALETTE}
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  if (d > 1.0) discard;
  float a = exp(-d * d * 5.0) * (1.0 - d);
  vec3 c = mix(cCyan, cViolet, clamp(vHue * 0.8 + uViolet * 0.35 - 0.1, 0.0, 1.0));
  c = mix(c, cHot, exp(-d * d * 30.0));
  gl_FragColor = vec4(max(c * a * vAlpha * uPartGlow, 0.0), 1.0);
}
`;

// ───────────────────────── Passe final ───────────────────────────────────────

export const FINAL_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Aberração cromática radial, tone mapping, sRGB e dithering. O alfa sai do
// próprio brilho, para que o halo se misture à página com o canvas transparente.
export const FINAL_FRAGMENT = /* glsl */ `
uniform sampler2D tDiffuse;
uniform float uAberration;
uniform float uExposure;
uniform float uFade;
uniform float uT;
varying vec2 vUv;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec3 toSRGB(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

void main() {
  vec2 c = vUv - 0.5;
  vec2 off = c * dot(c, c) * uAberration;
  vec4 base = texture2D(tDiffuse, vUv);
  vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, base.g, texture2D(tDiffuse, vUv - off).b);
  col = max(col, 0.0);
  // um pouco mais de saturação antes do tone mapping: o HDR não lava os azuis
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = max(mix(vec3(luma), col, 1.2), 0.0);
  col = 1.0 - exp(-col * uExposure);
  col = toSRGB(col);
  col += (hash12(gl_FragCoord.xy + fract(uT) * 61.0) - 0.5) / 255.0;
  // o halo morre antes da borda (o canvas nunca aparece como um quadrado) e a
  // imagem inteira some na saída (uFade), inclusive o vidro escuro
  float edge = smoothstep(0.5, 0.34, length(c)) * uFade;
  col *= edge;
  float alpha = clamp(max(base.a * edge, max(col.r, max(col.g, col.b))), 0.0, 1.0);
  gl_FragColor = vec4(clamp(col, 0.0, alpha), alpha);
}
`;
