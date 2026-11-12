import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import type { OrbFrame } from "./orb-motion";
import type { OrbTier } from "./orb-states";
import {
  AURA_FRAGMENT,
  AURA_VERTEX,
  BODY_FRAGMENT,
  BODY_VERTEX,
  FILAMENT_FRAGMENT,
  FILAMENT_VERTEX,
  FINAL_FRAGMENT,
  FINAL_VERTEX,
  PARTICLE_FRAGMENT,
  PARTICLE_VERTEX,
  SHELL_FRAGMENT,
  SHELL_VERTEX,
} from "./orb-shaders";

const CAMERA_DISTANCE = 7;
const FILAMENT_SEGMENTS = 160;

// Soma luz sem tocar no alfa: o alfa final vem do brilho, no passe final.
const ADDITIVE = {
  transparent: true,
  depthWrite: false,
  blending: THREE.CustomBlending,
  blendEquation: THREE.AddEquation,
  blendSrc: THREE.OneFactor,
  blendDst: THREE.OneFactor,
  blendSrcAlpha: THREE.ZeroFactor,
  blendDstAlpha: THREE.OneFactor,
} as const;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildNoiseTexture(random: () => number) {
  const size = 32;
  const data = new Uint8Array(size * size * size * 4);
  for (let i = 0; i < data.length; i++) data[i] = Math.floor(random() * 256);
  const texture = new THREE.Data3DTexture(data, size, size, size);
  texture.format = THREE.RGBAFormat;
  texture.type = THREE.UnsignedByteType;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = texture.wrapT = texture.wrapR = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

export class OrbRig {
  private readonly root = new THREE.Group();
  private readonly swarm = new THREE.Group();
  private readonly body: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
  private readonly shell: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
  private readonly aura: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
  private readonly filaments: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
  private readonly particles: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
  private readonly composer: EffectComposer;
  private readonly bloom: UnrealBloomPass;
  private readonly finalPass: ShaderPass;
  private readonly noise: THREE.Data3DTexture;
  private readonly lightA = new THREE.Vector3();
  private readonly lightB = new THREE.Vector3();
  private readonly invRoot = new THREE.Quaternion();
  private steps: number;
  private pointScale = 1;

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    private readonly scene: THREE.Scene,
    private readonly camera: THREE.PerspectiveCamera,
    tier: OrbTier,
  ) {
    this.steps = tier.steps;
    const random = mulberry32(20261111);
    this.noise = buildNoiseTexture(random);

    this.body = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, tier.detail),
      new THREE.ShaderMaterial({
        vertexShader: BODY_VERTEX,
        fragmentShader: BODY_FRAGMENT,
        uniforms: {
          uNoise: { value: this.noise },
          uT: { value: 0 },
          uFlow: { value: 0 },
          uDisplace: { value: 0 },
          uDispFreq: { value: 1 },
          uRipple: { value: 0 },
          uRipplePhase: { value: 0 },
          uIntensity: { value: 0 },
          uCore: { value: 0 },
          uTurb: { value: 0 },
          uViolet: { value: 0 },
          uSurge: { value: 0 },
          uAudio: { value: 0 },
          uSteps: { value: tier.steps },
          uRim: { value: 0 },
          uRing: { value: 0 },
          uRingPhase: { value: 0 },
          uLightA: { value: this.lightA },
          uLightB: { value: this.lightB },
        },
      }),
    );

    this.shell = new THREE.Mesh(
      new THREE.SphereGeometry(1.085, 96, 64),
      new THREE.ShaderMaterial({
        vertexShader: SHELL_VERTEX,
        fragmentShader: SHELL_FRAGMENT,
        uniforms: {
          uT: { value: 0 },
          uShell: { value: 0 },
          uViolet: { value: 0 },
          uLightA: { value: this.lightA },
        },
        ...ADDITIVE,
      }),
    );
    this.shell.renderOrder = 1;

    this.aura = new THREE.Mesh(
      new THREE.PlaneGeometry(6.4, 6.4),
      new THREE.ShaderMaterial({
        vertexShader: AURA_VERTEX,
        fragmentShader: AURA_FRAGMENT,
        uniforms: { uAura: { value: 0 }, uViolet: { value: 0 } },
        ...ADDITIVE,
      }),
    );
    this.aura.position.z = -1.4;
    scene.add(this.aura);

    this.filaments = this.buildFilaments(tier.filaments, random);
    this.particles = this.buildParticles(tier.particles, random);

    this.swarm.add(this.filaments, this.particles);
    this.swarm.rotation.set(0.28, 0, -0.12);
    this.root.add(this.body, this.shell, this.swarm);
    scene.add(this.root);

    const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: tier.samples });
    this.composer = new EffectComposer(renderer, target);
    this.composer.addPass(new RenderPass(scene, camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.2, 0.4, 1.0);
    const tints: [number, number, number][] = [
      [1, 1, 1],
      [0.75, 0.88, 1],
      [0.45, 0.66, 1],
      [0.3, 0.4, 1],
      [0.36, 0.26, 1],
    ];
    tints.forEach((tint, i) => this.bloom.bloomTintColors[i].set(...tint));
    this.composer.addPass(this.bloom);
    this.finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        vertexShader: FINAL_VERTEX,
        fragmentShader: FINAL_FRAGMENT,
        uniforms: {
          tDiffuse: { value: null },
          uAberration: { value: 0.03 },
          uExposure: { value: 1.0 },
          uFade: { value: 0 },
          uT: { value: 0 },
        },
        // o passe escreve cor já pré-multiplicada e não deve misturar com o destino
        blending: THREE.NoBlending,
        depthTest: false,
        depthWrite: false,
      }),
    );
    this.composer.addPass(this.finalPass);
  }

  private buildFilaments(count: number, random: () => number) {
    const strip = new THREE.PlaneGeometry(1, 1, FILAMENT_SEGMENTS, 1);
    const geometry = new THREE.InstancedBufferGeometry();
    geometry.index = strip.index;
    geometry.setAttribute("position", strip.attributes.position);
    geometry.setAttribute("uv", strip.attributes.uv);
    geometry.instanceCount = count;

    const quat = new Float32Array(count * 4);
    const a = new Float32Array(count * 4);
    const b = new Float32Array(count * 4);
    const q = new THREE.Quaternion();
    const euler = new THREE.Euler();
    for (let i = 0; i < count; i++) {
      euler.set((random() - 0.5) * Math.PI, random() * Math.PI * 2, (random() - 0.5) * Math.PI);
      q.setFromEuler(euler);
      quat.set([q.x, q.y, q.z, q.w], i * 4);
      a.set(
        [
          random(), // fase
          (0.55 + random() * 0.9) * (random() < 0.3 ? -1 : 1), // velocidade (alguns no sentido oposto)
          1.14 + random() * 0.4, // raio
          0.03 + random() * 0.04, // espessura
        ],
        i * 4,
      );
      b.set(
        [
          0.02 + random() * 0.06, // amplitude da ondulação
          2 + Math.floor(random() * 4), // frequência
          2.2 + random() * 2.6, // arco do rastro (rad)
          random(), // matiz
        ],
        i * 4,
      );
    }
    geometry.setAttribute("aQuat", new THREE.InstancedBufferAttribute(quat, 4));
    geometry.setAttribute("aA", new THREE.InstancedBufferAttribute(a, 4));
    geometry.setAttribute("aB", new THREE.InstancedBufferAttribute(b, 4));

    const mesh = new THREE.Mesh(
      geometry,
      new THREE.ShaderMaterial({
        vertexShader: FILAMENT_VERTEX,
        fragmentShader: FILAMENT_FRAGMENT,
        uniforms: {
          uSpin: { value: 0 },
          uT: { value: 0 },
          uArc: { value: 1 },
          uTight: { value: 0 },
          uFilGlow: { value: 0 },
          uViolet: { value: 0 },
        },
        side: THREE.DoubleSide,
        ...ADDITIVE,
      }),
    );
    // as posições são calculadas no shader; os limites da geometria não valem
    mesh.frustumCulled = false;
    mesh.renderOrder = 2;
    return mesh;
  }

  private buildParticles(count: number, random: () => number) {
    const geometry = new THREE.BufferGeometry();
    const s1 = new Float32Array(count * 4);
    const s2 = new Float32Array(count * 4);
    for (let i = 0; i < count * 4; i++) {
      s1[i] = random();
      s2[i] = random();
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geometry.setAttribute("aS1", new THREE.BufferAttribute(s1, 4));
    geometry.setAttribute("aS2", new THREE.BufferAttribute(s2, 4));

    const points = new THREE.Points(
      geometry,
      new THREE.ShaderMaterial({
        vertexShader: PARTICLE_VERTEX,
        fragmentShader: PARTICLE_FRAGMENT,
        uniforms: {
          uOrbit: { value: 0 },
          uT: { value: 0 },
          uTight: { value: 0 },
          uSize: { value: 1 },
          uPartGlow: { value: 0 },
          uViolet: { value: 0 },
        },
        ...ADDITIVE,
      }),
    );
    points.frustumCulled = false;
    points.renderOrder = 3;
    return points;
  }

  resize(width: number, height: number, dpr: number) {
    if (width <= 0 || height <= 0) return;
    const aspect = width / height;
    this.camera.position.set(0, 0, CAMERA_DISTANCE / Math.min(1, aspect));
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    // o composer não arredonda: um dpr fracionado criaria buffers de tamanho quebrado
    this.composer.setPixelRatio(1);
    this.composer.setSize(Math.max(1, Math.round(width * dpr)), Math.max(1, Math.round(height * dpr)));
    this.pointScale = (Math.min(width, height) / 520) * dpr;
  }

  setSteps(steps: number) {
    this.steps = steps;
  }

  getSteps() {
    return this.steps;
  }

  update(f: OrbFrame) {
    const glow = f.reveal;
    const body = this.body.material.uniforms;
    body.uT.value = f.t;
    body.uFlow.value = f.flowPhase;
    body.uDisplace.value = f.displace * (1 + f.audio * f.audioGlow * 0.6);
    body.uDispFreq.value = f.dispFreq;
    body.uRipple.value = f.ripple * (0.35 + f.audio * 1.3);
    body.uRipplePhase.value = f.ripplePhase;
    body.uIntensity.value = f.intensity * glow * (1 + f.audio * f.audioGlow * 0.2);
    body.uCore.value = f.core;
    body.uTurb.value = f.turbulence;
    body.uViolet.value = f.violet;
    body.uSurge.value = f.surge;
    body.uAudio.value = f.audio * f.audioGlow;
    body.uSteps.value = this.steps;
    body.uRim.value = f.shell * glow;
    body.uRing.value = f.ring;
    body.uRingPhase.value = f.ringPhase;

    // luzes levadas ao espaço do objeto para não girarem junto com a esfera
    this.root.rotation.set(f.pointerY * 0.2, f.pointerX * 0.3, 0);
    this.invRoot.copy(this.root.quaternion).invert();
    this.lightA
      .set(-0.5 + f.pointerX * 0.55, 0.7 - f.pointerY * 0.45, 0.6)
      .normalize()
      .applyQuaternion(this.invRoot);
    this.lightB
      .set(Math.cos(f.t * 0.23) * 0.8, -0.35 + Math.sin(f.t * 0.17) * 0.3, Math.sin(f.t * 0.23) * 0.8)
      .normalize()
      .applyQuaternion(this.invRoot);

    const shell = this.shell.material.uniforms;
    shell.uT.value = f.t;
    shell.uShell.value = f.shell * glow * (0.9 + f.audio * f.audioGlow * 0.7 + f.surge * 0.5);
    shell.uViolet.value = f.violet;

    const fil = this.filaments.material.uniforms;
    fil.uSpin.value = f.spinPhase;
    fil.uT.value = f.t;
    fil.uArc.value = f.filArc;
    fil.uTight.value = f.partTight;
    fil.uFilGlow.value = f.filGlow * glow * (1 + f.surge * 0.9 + f.audio * f.audioGlow * 0.5);
    fil.uViolet.value = f.violet;

    const part = this.particles.material.uniforms;
    part.uOrbit.value = f.orbitPhase;
    part.uT.value = f.t;
    part.uTight.value = f.partTight;
    part.uSize.value = 5.5 * this.pointScale;
    part.uPartGlow.value = f.partGlow * glow * (1 + f.surge * 0.6);
    part.uViolet.value = f.violet;

    const aura = this.aura.material.uniforms;
    aura.uAura.value = glow * f.bloom * (0.15 + f.core * 0.05 + f.audio * f.audioGlow * 0.08 + f.surge * 0.06);
    aura.uViolet.value = f.violet;
    this.aura.scale.setScalar(f.scale);

    this.body.scale.setScalar(f.scale);
    this.shell.scale.setScalar(f.scale);
    this.swarm.scale.setScalar(0.85 + 0.15 * f.reveal);
    this.swarm.rotation.y = f.t * 0.05;

    this.bloom.strength = 0.24 * f.bloom * glow * (1 + f.surge * 0.25 + f.audio * f.audioGlow * 0.3);
    this.finalPass.uniforms.uT.value = f.t;
    this.finalPass.uniforms.uFade.value = Math.min(1, f.reveal * 1.6);
  }

  render(delta: number) {
    this.composer.render(delta);
  }

  dispose() {
    this.scene.remove(this.root, this.aura);
    for (const object of [this.body, this.shell, this.aura, this.filaments, this.particles]) {
      object.geometry.dispose();
      object.material.dispose();
    }
    this.noise.dispose();
    this.finalPass.dispose();
    this.bloom.dispose();
    this.composer.dispose();
  }
}
