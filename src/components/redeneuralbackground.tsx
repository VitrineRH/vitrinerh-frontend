// Plexus Network Background by Made for Award: https://www.madeforaward.com/ui/backgrounds/plexus-network-background
// Free and open source (MIT). If it helped, a star means a lot: https://github.com/shivc868/madeforaward-ui
'use client'

import {useEffect, useRef, type ReactNode} from 'react'

export type PlexusNetworkBackgroundProps = {
  /** colour of the links */
  lineColor?: string
  /** colour of the nodes and the light around the cursor */
  nodeColor?: string
  /** page colour behind the network; 'transparent' lets the page show through
   *  (follows the theme) and fades the network out at the edges */
  background?: string
  /** size of the mesh; higher = more, smaller cells */
  scale?: number
  /** drift speed; 0 = still */
  speed?: number
  /** nodes near the cursor push away and their links light up */
  interactive?: boolean
  /** render resolution as a share of the screen's */
  quality?: number
  children?: ReactNode
  className?: string
}

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`

// A drifting mesh of nodes in two layers of depth. Each grid cell owns one
// node that wanders round its cell; a pixel looks at the nodes of its own
// cell and its eight neighbours and draws the links from the middle one
// (plus the four diagonals between neighbours, so no cell edge shows).
// Links fade with their length, nodes twinkle, and near the cursor the
// nodes are pushed aside and their links light up.
const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uScale;
uniform vec3 uPointer;
uniform vec3 uBackground;
uniform vec3 uLine;
uniform vec3 uNode;
uniform float uSolid;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

vec2 hash2(vec2 p) {
  float n = hash(p);
  return vec2(n, hash(p + n));
}

float segment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0));
}

// A node's place in grid units: wandering round its cell, pushed off the cursor.
vec2 node(vec2 cell, float t, vec2 ptr) {
  vec2 n = hash2(cell);
  vec2 q = cell + 0.5 + 0.38 * sin(n * 6.2831 + t * (0.4 + n.yx * 0.6));
  vec2 away = q - ptr;
  return q + away * 0.6 * uPointer.z * exp(-dot(away, away) * 0.6);
}

// x = link light, y = node light, z = how near the cursor (0–1).
vec3 layer(vec2 uv, float t, vec2 ptr, float px) {
  vec2 id = floor(uv);
  vec2 n[9];
  for (int i = 0; i < 9; i++) n[i] = node(id + vec2(i % 3 - 1, i / 3 - 1), t, ptr);

  float lines = 0.0, nodes = 0.0;
  for (int i = 0; i < 9; i++) {
    if (i != 4) lines += (1.0 - smoothstep(px * 0.6, px * 1.6, segment(uv, n[4], n[i]))) * smoothstep(1.25, 0.65, length(n[i] - n[4]));
    float twinkle = 0.6 + 0.4 * sin(t * 3.0 + hash(id + vec2(i % 3, i / 3)) * 40.0);
    vec2 j = (uv - n[i]) / (px * 5.0);
    nodes += twinkle / (1.0 + dot(j, j)) * smoothstep(0.9, 0.3, length(uv - n[i]));
  }
  for (int k = 0; k < 4; k++) {
    vec2 a = n[k < 2 ? 1 : 7], b = n[k % 2 == 0 ? 3 : 5];
    lines += (1.0 - smoothstep(px * 0.6, px * 1.6, segment(uv, a, b))) * smoothstep(1.25, 0.65, length(a - b));
  }
  vec2 dp = uv - ptr;
  return vec3(lines, nodes, uPointer.z * exp(-dot(dp, dp) * 0.35));
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  vec2 ptr = (uPointer.xy - 0.5 * uResolution) / uResolution.y;
  float t = uTime;

  // Near layer, then a smaller, dimmer one behind it drifting the other way.
  vec3 near = layer(p * uScale, t, ptr * uScale, uScale / uResolution.y);
  float s2 = uScale * 1.8;
  vec2 off = vec2(13.7, 4.1) - t * vec2(0.03, 0.01);
  vec3 far = layer(p * s2 + off, t * 0.7, ptr * s2 + off, s2 / uResolution.y);

  float lineLight = near.x * (0.55 + 1.2 * near.z) + far.x * 0.2;
  float nodeLight = near.y * (0.8 + near.z) + far.y * 0.3 + near.z * 0.06;

  if (uSolid > 0.5) {
    vec3 col = uBackground + uLine * lineLight + uNode * nodeLight;
    col *= 1.0 - 0.45 * smoothstep(0.35, 1.25, length(p * vec2(0.85, 1.15)));
    col += (hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0;
    outColor = vec4(col, 1.0);
    return;
  }

  vec2 q = gl_FragCoord.xy / uResolution;
  float mask = smoothstep(0.0, 0.2, q.x) * smoothstep(1.0, 0.8, q.x)
             * smoothstep(0.0, 0.3, q.y) * smoothstep(1.0, 0.7, q.y);
  float aLine = clamp(lineLight, 0.0, 1.0) * mask;
  float aNode = clamp(nodeLight, 0.0, 1.0) * mask;
  vec3 c = uNode * aNode + uLine * aLine * (1.0 - aNode);
  outColor = vec4(c, aNode + aLine * (1.0 - aNode));
}`

// A plexus network on WebGL2: one fullscreen triangle and one shader. It pauses
// when it is off screen or the tab is hidden, and holds still for reduced
// motion.
export default function PlexusNetworkBackground({
  lineColor = '#3f7bff',
  nodeColor = '#9fe8ff',
  background = 'transparent',
  scale = 6,
  speed = 1,
  interactive = true,
  quality = 1,
  children,
  className = '',
}: PlexusNetworkBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl2', {antialias: false, depth: false, stencil: false})
    if (!root || !canvas || !gl) return

    const program = link(gl)
    if (!program) return
    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const u = {
      resolution: uniform('uResolution'),
      time: uniform('uTime'),
      pointer: uniform('uPointer'),
    }
    gl.useProgram(program)
    const vao = gl.createVertexArray()
    const buffer = gl.createBuffer()
    gl.bindVertexArray(vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.uniform1f(uniform('uScale'), scale)
    gl.uniform3fv(uniform('uBackground'), toRgb(background))
    gl.uniform1f(uniform('uSolid'), background === 'transparent' ? 0 : 1)
    gl.uniform3fv(uniform('uLine'), toRgb(lineColor))
    gl.uniform3fv(uniform('uNode'), toRgb(nodeColor))

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // The pointer in canvas pixels (y up) and how strongly it pushes (0–1),
    // eased toward the cursor so the nodes drift aside, not jump.
    const pointer = {x: 0, y: 0, pull: 0, tx: 0, ty: 0, target: 0}
    let ratio = 1
    let clock = 6
    let last = 0
    let raf = 0
    let visible = true

    const draw = () => {
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(u.resolution, canvas.width, canvas.height)
      gl.uniform1f(u.time, clock)
      gl.uniform3f(u.pointer, pointer.x, pointer.y, pointer.pull)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    const frame = (now: number) => {
      raf = 0
      if (!visible || document.hidden) return
      const dt = last ? Math.min(now - last, 50) / 1000 : 0
      last = now
      clock += dt * speed
      const ease = 1 - Math.exp(-dt * 5)
      pointer.x += (pointer.tx - pointer.x) * ease
      pointer.y += (pointer.ty - pointer.y) * ease
      pointer.pull += (pointer.target - pointer.pull) * ease
      draw()
      raf = requestAnimationFrame(frame)
    }
    const wake = () => {
      last = 0
      if (!raf && !still && visible && !document.hidden) raf = requestAnimationFrame(frame)
    }

    // On the window, so content laid over the background doesn't block it.
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      pointer.tx = (e.clientX - r.left) * ratio
      pointer.ty = (r.bottom - e.clientY) * ratio
      if (inside && !pointer.target) Object.assign(pointer, {x: pointer.tx, y: pointer.ty})
      pointer.target = inside ? 1 : 0
    }
    if (interactive && !still) window.addEventListener('pointermove', onMove)

    const ro = new ResizeObserver(() => {
      ratio = Math.min(window.devicePixelRatio || 1, 2) * quality
      canvas.width = Math.max(1, Math.round(root.clientWidth * ratio))
      canvas.height = Math.max(1, Math.round(root.clientHeight * ratio))
      draw()
    })
    ro.observe(root)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      wake()
    })
    io.observe(root)
    document.addEventListener('visibilitychange', wake)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', wake)
      window.removeEventListener('pointermove', onMove)
      // Keep the context (a canvas hands the same one back on remount).
      gl.deleteBuffer(buffer)
      gl.deleteVertexArray(vao)
      gl.deleteProgram(program)
    }
  }, [lineColor, nodeColor, background, scale, speed, interactive, quality])

  return (
    <div ref={rootRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block h-full w-full" />
      {children != null && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  )
}

function link(gl: WebGL2RenderingContext) {
  const program = gl.createProgram()
  for (const [type, source] of [
    [gl.VERTEX_SHADER, VERTEX],
    [gl.FRAGMENT_SHADER, FRAGMENT],
  ] as const) {
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    gl.attachShader(program, shader)
  }
  gl.bindAttribLocation(program, 0, 'aPosition')
  gl.linkProgram(program)
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null
}

// Any CSS colour → 0–1 RGB for the shader.
function toRgb(color: string): [number, number, number] {
  const ctx = document.createElement('canvas').getContext('2d', {willReadFrequently: true})!
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r / 255, g / 255, b / 255]
}
