import React, { useEffect, useRef } from 'react';

const SOURCE_URLS = {
  day: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261125_123040_f513c6f7-07d8-410f-a6de-4545268d7e1f.png',
  night: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261125_123132_feb5ca9b-fc48-4930-80a0-a8f2fb824330.png',
  facade: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261125_063353_1267b8e6-3e85-4dde-b424-1647f0a4de2e.png',
  band: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261125_063406_591aa9e3-ad36-4e74-9aa7-01de368920f9.png',
} as const;

const PROXY_BASE = 'https://images.higgs.ai/?default=1&output=webp&url=';
const ALLOWED_WIDTHS = [1280, 1600, 1920, 2496] as const;

function pickProxyWidth(cssWidth: number, cap = 2496): number {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const target = cssWidth * dpr;
  const chosen = ALLOWED_WIDTHS.find((w) => w >= target) ?? 2496;
  return Math.min(chosen, cap);
}

function buildProxyUrl(sourceUrl: string, width: number): string {
  return `${PROXY_BASE}${encodeURIComponent(sourceUrl)}&q=85&w=${width}`;
}

// 30 fps lookup tables measured frame by frame from the reference reel
const FACADE_S = [
  0, 0, 1, 2, 3, 6, 10, 15, 22, 30, 40, 51, 64, 79, 95, 112, 129, 148, 166.5,
  185, 203.5, 222, 240.5, 259, 277.5, 296, 314.5, 333, 351.5,
].map((v) => v / 664);

const PIECE_P = [
  0, 0.005, 0.012, 0.019, 0.021, 0.03, 0.043, 0.061, 0.082, 0.109, 0.141,
  0.176, 0.216, 0.261, 0.308, 0.358, 0.41, 0.464, 0.518, 0.573, 0.626, 0.678,
  0.727, 0.773, 0.814, 0.852, 0.885, 0.915, 0.938, 0.958, 0.972, 0.983, 0.992,
  0.996, 0.999, 1,
];

const NIGHT_T = [
  0, 0.02, 0.04, 0.05, 0.07, 0.09, 0.11, 0.14, 0.18, 0.21, 0.26, 0.3, 0.36,
  0.41, 0.48, 0.54, 0.6, 0.67, 0.74, 0.79, 0.85, 0.91, 0.98, 1,
];

const PAN_T = [
  0, 0.25, 0.5, 1.25, 2.5, 4.25, 6.5, 9.5, 13.25, 17.5, 22.5, 28.25, 34.25,
  40.75, 47.75, 55.25, 62.75, 70.5, 78.5, 86.5, 94.25, 101.5, 108.5, 114.75,
  120.75, 125.75, 130.25, 133.75, 136.5, 138.5, 139.5, 139.75,
].map((v) => v / 139.75);

const LEDGE_T = [
  1.02, 0.978, 0.95, 0.921, 0.895, 0.871, 0.851, 0.834, 0.818, 0.807, 0.801,
  0.799,
];

function sampleTable(table: readonly number[], index: number): number {
  if (index <= 0) return table[0];
  const last = table.length - 1;
  if (index >= last) return table[last];
  const i = Math.floor(index);
  const f = index - i;
  return table[i] + (table[i + 1] - table[i]) * f;
}

interface PieceDef {
  id: string;
  a: number;
  b: number;
  u0: number;
  u1: number;
}

// Eight full-height vertical street pieces (A and H carry 9% mirrored overhang)
const PIECES_DEF: readonly PieceDef[] = [
  { id: 'A', a: 0, b: 0.2045, u0: -0.09, u1: 0.2045 },
  { id: 'B', a: 0.2045, b: 0.325, u0: 0.2045, u1: 0.325 },
  { id: 'C', a: 0.325, b: 0.35, u0: 0.325, u1: 0.35 },
  { id: 'D', a: 0.35, b: 0.372, u0: 0.35, u1: 0.372 },
  { id: 'E', a: 0.372, b: 0.628, u0: 0.372, u1: 0.628 },
  { id: 'F', a: 0.628, b: 0.76, u0: 0.628, u1: 0.76 },
  { id: 'G', a: 0.76, b: 0.805, u0: 0.76, u1: 0.805 },
  { id: 'H', a: 0.805, b: 1, u0: 0.805, u1: 1.09 },
];

// Inner pieces drawn first, outer pieces drawn last (A & H on top)
const DRAW_ORDER = [4, 3, 5, 2, 6, 1, 0, 7] as const;

const VERT_SRC = `#version 300 es
in vec2 a_uv;
uniform vec2 u_res;
uniform vec3 u_plate;
uniform float u_offset;
uniform float u_pan;
out vec2 v_uv;
void main() {
  float u = a_uv.x;
  float v = a_uv.y;
  float xf = u_plate.x + u * u_plate.y;
  float d = (xf - u_res.x * 0.5) / u_res.x;
  float r = min(0.32, 0.022 + 1.02 * pow(abs(d), 1.5));
  float x = xf + u_offset;
  float y = v * u_plate.z - u_pan * r * u_res.y;
  vec2 clip = vec2((x / u_res.x) * 2.0 - 1.0, 1.0 - (y / u_res.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  v_uv = a_uv;
}
`;

const FRAG_SRC = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_day;
uniform sampler2D u_night;
uniform float u_nightMix;
out vec4 fragColor;
float mirrorU(float u) {
  if (u < 0.0) return -u;
  if (u > 1.0) return 2.0 - u;
  return u;
}
void main() {
  float u = mirrorU(v_uv.x);
  float v = v_uv.y;
  vec4 dayCol = texture(u_day, vec2(u, v));
  float nu = clamp(u + 0.0016 * clamp((0.87 - u) / 0.37, 0.0, 1.0), 0.0, 1.0);
  vec4 nightCol = texture(u_night, vec2(nu, v));
  fragColor = mix(dayCol, nightCol, u_nightMix);
}
`;

interface PieceMetrics {
  def: PieceDef;
  travel: number;
  dir: number; // +1 for left pieces, -1 for right pieces, 0 for center
  lead: number;
  rCenter: number;
}

interface Geometry {
  W: number;
  H: number;
  pw: number;
  ph: number;
  px: number;
  fw: number;
  fh: number;
  gap: number;
  bandH: number;
  titleSize: number;
  titleTop: number;
  pieces: PieceMetrics[];
}

interface GLState {
  gl: WebGL2RenderingContext;
  canvas: HTMLCanvasElement;
  program: WebGLProgram;
  vaos: WebGLVertexArrayObject[];
  vertCount: number;
  dayTex: WebGLTexture;
  nightTex: WebGLTexture;
  uRes: WebGLUniformLocation | null;
  uPlate: WebGLUniformLocation | null;
  uOffset: WebGLUniformLocation | null;
  uPan: WebGLUniformLocation | null;
  uDay: WebGLUniformLocation | null;
  uNight: WebGLUniformLocation | null;
  uNightMix: WebGLUniformLocation | null;
}

interface Canvas2DPiece {
  defIndex: number;
  wrapper: HTMLDivElement;
  dayCanvas: HTMLCanvasElement;
  nightCanvas: HTMLCanvasElement;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      if (typeof img.decode === 'function') {
        img
          .decode()
          .then(() => resolve(img))
          .catch(() => resolve(img));
      } else {
        resolve(img);
      }
    };
    img.onerror = () => reject(new Error(`Failed to load ${url}`));
    img.src = url;
  });
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createTexture(
  gl: WebGL2RenderingContext,
  image: HTMLImageElement
): WebGLTexture | null {
  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  return tex;
}

function buildGLState(
  container: HTMLDivElement,
  dayImg: HTMLImageElement,
  nightImg: HTMLImageElement
): GLState | null {
  const canvas = document.createElement('canvas');
  canvas.className = 'gl-canvas';
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: 'high-performance',
  });
  if (!gl) return null;

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  const dayTex = createTexture(gl, dayImg);
  const nightTex = createTexture(gl, nightImg);
  if (!dayTex || !nightTex) return null;

  const aUv = gl.getAttribLocation(program, 'a_uv');
  const cols = 48;
  const vertCount = (cols + 1) * 2;
  const vaos: WebGLVertexArrayObject[] = [];

  for (let p = 0; p < PIECES_DEF.length; p++) {
    const def = PIECES_DEF[p];
    const data = new Float32Array(vertCount * 2);
    for (let i = 0; i <= cols; i++) {
      const t = i / cols;
      const u = def.u0 + (def.u1 - def.u0) * t;
      const base = i * 4;
      data[base] = u;
      data[base + 1] = 0;
      data[base + 2] = u;
      data[base + 3] = 1;
    }
    const vao = gl.createVertexArray();
    const buf = gl.createBuffer();
    if (!vao || !buf) return null;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    vaos.push(vao);
  }

  container.innerHTML = '';
  container.appendChild(canvas);

  return {
    gl,
    canvas,
    program,
    vaos,
    vertCount,
    dayTex,
    nightTex,
    uRes: gl.getUniformLocation(program, 'u_res'),
    uPlate: gl.getUniformLocation(program, 'u_plate'),
    uOffset: gl.getUniformLocation(program, 'u_offset'),
    uPan: gl.getUniformLocation(program, 'u_pan'),
    uDay: gl.getUniformLocation(program, 'u_day'),
    uNight: gl.getUniformLocation(program, 'u_night'),
    uNightMix: gl.getUniformLocation(program, 'u_nightMix'),
  };
}

function drawMirroredSliceToCanvas(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  u0: number,
  u1: number,
  widthCss: number,
  heightCss: number,
  nightShift: boolean
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.round(widthCss * dpr));
  const h = Math.max(1, Math.round(heightCss * dpr));
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = `${widthCss}px`;
  canvas.style.height = `${heightCss}px`;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const span = u1 - u0;

  // Draw left mirrored overhang if u0 < 0
  if (u0 < 0) {
    const mirrorSpan = -u0;
    const dstW = (mirrorSpan / span) * w;
    ctx.save();
    ctx.translate(dstW, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, mirrorSpan * iw, ih, 0, 0, dstW, h);
    ctx.restore();
  }

  // Draw primary in-bounds [0, 1] portion
  const cl0 = Math.max(0, u0);
  const cl1 = Math.min(1, u1);
  if (cl1 > cl0) {
    const shift = nightShift
      ? 0.0016 * Math.max(0, Math.min(1, (0.87 - (cl0 + cl1) * 0.5) / 0.37))
      : 0;
    const sx = Math.min(1, Math.max(0, cl0 + shift)) * iw;
    const sw = Math.max(1, (cl1 - cl0) * iw);
    const dx = ((cl0 - u0) / span) * w;
    const dw = ((cl1 - cl0) / span) * w;
    ctx.drawImage(img, sx, 0, sw, ih, dx, 0, dw, h);
  }

  // Draw right mirrored overhang if u1 > 1
  if (u1 > 1) {
    const mirrorSpan = u1 - 1;
    const dx = ((1 - u0) / span) * w;
    const dstW = (mirrorSpan / span) * w;
    ctx.save();
    ctx.translate(dx + dstW, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(
      img,
      (1 - mirrorSpan) * iw,
      0,
      mirrorSpan * iw,
      ih,
      0,
      0,
      dstW,
      h
    );
    ctx.restore();
  }
}

export const NocheVivaHero: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const worldDayRef = useRef<HTMLImageElement | null>(null);
  const worldNightRef = useRef<HTMLImageElement | null>(null);
  const layersRef = useRef<HTMLDivElement | null>(null);
  const bandRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const halfLeftRef = useRef<HTMLDivElement | null>(null);
  const halfRightRef = useRef<HTMLDivElement | null>(null);
  const facadeLeftImgRef = useRef<HTMLImageElement | null>(null);
  const facadeRightImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const trackEl = trackRef.current;
    const heroEl = heroRef.current;
    const worldEl = worldRef.current;
    const worldDayEl = worldDayRef.current;
    const worldNightEl = worldNightRef.current;
    const layersEl = layersRef.current;
    const bandEl = bandRef.current;
    const titleEl = titleRef.current;
    const halfLeftEl = halfLeftRef.current;
    const halfRightEl = halfRightRef.current;
    const facadeLeftImg = facadeLeftImgRef.current;
    const facadeRightImg = facadeRightImgRef.current;

    if (
      !trackEl ||
      !heroEl ||
      !worldEl ||
      !worldDayEl ||
      !worldNightEl ||
      !layersEl ||
      !bandEl ||
      !titleEl ||
      !halfLeftEl ||
      !halfRightEl ||
      !facadeLeftImg ||
      !facadeRightImg
    ) {
      return;
    }

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let destroyed = false;
    let rafId = 0;
    let resizeTimer = 0;
    let fallbackTimer = 0;

    let mode: 'loading' | 'webgl' | 'canvas2d' | 'plates' = 'loading';
    let glState: GLState | null = null;
    let c2dPieces: Canvas2DPiece[] = [];
    let loadedDayImg: HTMLImageElement | null = null;
    let loadedNightImg: HTMLImageElement | null = null;

    let readyAt = 0;
    let introDone = reducedMotion;
    let sCur = 0;
    let sVel = 0;
    let lastTime = 0;

    const computeGeometry = (): Geometry => {
      const W = heroEl.clientWidth || window.innerWidth;
      const H = heroEl.clientHeight || window.innerHeight;

      const ph = Math.max(W / 1.506, 1.26 * H);
      const pw = 1.506 * ph;
      const px = (W - pw) / 2;

      const coverByWidth = W / H > 1.5;
      const fw = coverByWidth ? W : 1.5 * H;
      const fh = coverByWidth ? W / 1.5 : H;
      const gap = (8.5 / 664) * W;

      const bandH = (1 - 0.799 + 0.03) * H;
      const titleSize = Math.min(0.118 * H, 0.105 * W);
      const titleTop = (1 - 0.799) * H * 0.56 - titleSize / 2;

      const pieces: PieceMetrics[] = PIECES_DEF.map((def) => {
        const x0 = px + def.a * pw;
        const x1 = px + def.b * pw;
        const sx0 = Math.max(0, x0);
        const sx1 = Math.min(W, x1);
        const containsCenter = x0 <= W * 0.5 && x1 >= W * 0.5;

        let travel = 0;
        let dir = 0;
        let midPx = W * 0.5;

        if (!containsCenter) {
          midPx = sx1 > sx0 ? (sx0 + sx1) * 0.5 : (x0 + x1) * 0.5;
          const c = midPx / W;
          travel = 0.93 * Math.abs(c - 0.5) * W;
          dir = c < 0.5 ? 1 : -1;
        }

        const lead = Math.max(0, 0.25 * (0.41 - travel / W));
        const dCenter = (midPx - W * 0.5) / W;
        const rCenter = Math.min(
          0.32,
          0.022 + 1.02 * Math.pow(Math.abs(dCenter), 1.5)
        );

        return { def, travel, dir, lead, rCenter };
      });

      return { W, H, pw, ph, px, fw, fh, gap, bandH, titleSize, titleTop, pieces };
    };

    let geom = computeGeometry();

    const applyStaticGeometry = (g: Geometry) => {
      const halfW = g.W / 2 - g.gap;

      // Left & right facade blocks
      halfLeftEl.style.width = `${halfW}px`;
      facadeLeftImg.style.width = `${g.fw}px`;
      facadeLeftImg.style.height = `${g.fh}px`;
      facadeLeftImg.style.left = `${g.W / 2 - g.gap - g.fw / 2}px`;
      facadeLeftImg.style.top = `${(g.H - g.fh) / 2}px`;

      halfRightEl.style.width = `${halfW}px`;
      facadeRightImg.style.width = `${g.fw}px`;
      facadeRightImg.style.height = `${g.fh}px`;
      facadeRightImg.style.left = `${-g.fw / 2}px`;
      facadeRightImg.style.top = `${(g.H - g.fh) / 2}px`;

      // Ledge band & NOCHE VIVA title
      bandEl.style.height = `${g.bandH}px`;
      titleEl.style.fontSize = `${g.titleSize}px`;
      titleEl.style.top = `${g.titleTop}px`;

      // Fallback world plates
      for (const img of [worldDayEl, worldNightEl]) {
        img.style.width = `${g.pw}px`;
        img.style.height = `${g.ph}px`;
        img.style.left = `${g.px}px`;
      }

      // WebGL2 canvas pixel dimensions
      if (glState) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const cw = Math.max(1, Math.round(g.W * dpr));
        const ch = Math.max(1, Math.round(g.H * dpr));
        if (glState.canvas.width !== cw || glState.canvas.height !== ch) {
          glState.canvas.width = cw;
          glState.canvas.height = ch;
        }
      }

      // Canvas2D fallback pieces
      if (mode === 'canvas2d' && loadedDayImg && loadedNightImg) {
        for (const item of c2dPieces) {
          const def = PIECES_DEF[item.defIndex];
          const x0 = g.px + def.u0 * g.pw;
          const sliceW = (def.u1 - def.u0) * g.pw;
          item.wrapper.style.left = `${x0}px`;
          item.wrapper.style.width = `${sliceW}px`;
          item.wrapper.style.height = `${g.ph}px`;
          drawMirroredSliceToCanvas(
            item.dayCanvas,
            loadedDayImg,
            def.u0,
            def.u1,
            sliceW,
            g.ph,
            false
          );
          drawMirroredSliceToCanvas(
            item.nightCanvas,
            loadedNightImg,
            def.u0,
            def.u1,
            sliceW,
            g.ph,
            true
          );
        }
      }
    };

    const buildCanvas2DFallback = (
      dayImg: HTMLImageElement,
      nightImg: HTMLImageElement
    ) => {
      layersEl.innerHTML = '';
      c2dPieces = [];
      for (const idx of DRAW_ORDER) {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.top = '0';
        wrapper.style.willChange = 'transform';

        const dayCanvas = document.createElement('canvas');
        dayCanvas.style.position = 'absolute';
        dayCanvas.style.inset = '0';
        dayCanvas.style.display = 'block';

        const nightCanvas = document.createElement('canvas');
        nightCanvas.style.position = 'absolute';
        nightCanvas.style.inset = '0';
        nightCanvas.style.display = 'block';
        nightCanvas.style.opacity = '0';
        nightCanvas.style.willChange = 'opacity';

        wrapper.appendChild(dayCanvas);
        wrapper.appendChild(nightCanvas);
        layersEl.appendChild(wrapper);
        c2dPieces.push({ defIndex: idx, wrapper, dayCanvas, nightCanvas });
      }
      mode = 'canvas2d';
      applyStaticGeometry(geom);
    };

    const getScrollProgress = (): number => {
      const maxScroll = Math.max(1, trackEl.offsetHeight - window.innerHeight);
      return Math.max(0, Math.min(1, window.scrollY / maxScroll));
    };

    const renderFrame = (now: number) => {
      rafId = 0;
      if (destroyed) return;

      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
      lastTime = now;

      const g = geom;
      let T = 0;

      if (reducedMotion) {
        T = 10;
        introDone = true;
      } else if (mode === 'loading') {
        // Hold Frame 1 until assets & fonts are decoded
        bandEl.style.transform = `translate3d(0, ${1.02 * g.H}px, 0)`;
        return;
      } else {
        T = (now - readyAt) / 1000 - 0.4;
        if (T >= 1.17) {
          introDone = true;
        }
      }

      // Facade blocks split & street window clip
      if (reducedMotion || mode === 'plates') {
        halfLeftEl.style.display = 'none';
        halfRightEl.style.display = 'none';
        layersEl.style.clipPath = 'none';
      } else {
        const s = sampleTable(FACADE_S, T * 30);
        const shiftPx = s * g.W;
        if (shiftPx > g.W / 2 + 2) {
          halfLeftEl.style.display = 'none';
          halfRightEl.style.display = 'none';
          layersEl.style.clipPath = 'none';
        } else {
          halfLeftEl.style.display = 'block';
          halfRightEl.style.display = 'block';
          halfLeftEl.style.transform = `translate3d(${-shiftPx}px, 0, 0)`;
          halfRightEl.style.transform = `translate3d(${shiftPx}px, 0, 0)`;

          const windowHalf = (8.5 / 664 + s - 8 / 664) * g.W;
          const clipX = Math.max(0, g.W / 2 - windowHalf);
          layersEl.style.clipPath = `inset(0px ${clipX}px 0px ${clipX}px)`;
        }
      }

      // Scroll-driven critically damped spring (omega = 9)
      const sp = getScrollProgress();
      const target = introDone ? sp : 0;

      if (reducedMotion) {
        sCur = target;
        sVel = 0;
      } else {
        const omega = 9;
        const acc = omega * omega * (target - sCur) - 2 * omega * sVel;
        sVel += acc * dt;
        sCur += sVel * dt;
        if (Math.abs(target - sCur) < 1e-4 && Math.abs(sVel) < 1e-4) {
          sCur = target;
          sVel = 0;
        }
      }

      const k = 113 + sCur * 35;
      const nightAmount = sampleTable(NIGHT_T, k - 113);
      const pan = sampleTable(PAN_T, k - 116);
      const ledgeFrac = sampleTable(LEDGE_T, k - 137);

      // Position stone ledge band
      bandEl.style.transform = `translate3d(0, ${ledgeFrac * g.H}px, 0)`;

      // Render street scene
      if (mode === 'webgl' && glState) {
        const { gl } = glState;
        gl.viewport(0, 0, glState.canvas.width, glState.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(glState.program);

        gl.uniform2f(glState.uRes, g.W, g.H);
        gl.uniform3f(glState.uPlate, g.px, g.pw, g.ph);
        gl.uniform1f(glState.uPan, pan);
        gl.uniform1f(glState.uNightMix, nightAmount);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, glState.dayTex);
        gl.uniform1i(glState.uDay, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, glState.nightTex);
        gl.uniform1i(glState.uNight, 1);

        for (const idx of DRAW_ORDER) {
          const pm = g.pieces[idx];
          const p = reducedMotion
            ? 1
            : sampleTable(PIECE_P, (T + pm.lead) * 30);
          const offset = pm.dir * (1 - p) * pm.travel;
          gl.uniform1f(glState.uOffset, offset);
          gl.bindVertexArray(glState.vaos[idx]);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, glState.vertCount);
        }
        gl.bindVertexArray(null);
      } else if (mode === 'canvas2d') {
        for (const item of c2dPieces) {
          const pm = g.pieces[item.defIndex];
          const p = reducedMotion
            ? 1
            : sampleTable(PIECE_P, (T + pm.lead) * 30);
          const offset = pm.dir * (1 - p) * pm.travel;
          const riseY = -pan * pm.rCenter * g.H;
          item.wrapper.style.transform = `translate3d(${offset}px, ${riseY}px, 0)`;
          item.nightCanvas.style.opacity = String(nightAmount);
        }
      } else if (mode === 'plates') {
        const riseY = -0.2 * pan * g.H;
        worldDayEl.style.transform = `translate3d(0, ${riseY}px, 0)`;
        worldNightEl.style.transform = `translate3d(0, ${riseY}px, 0)`;
        worldNightEl.style.opacity = String(nightAmount);
      }

      // Keep looping only while intro runs or spring is settling
      const springActive =
        !reducedMotion &&
        (Math.abs(target - sCur) >= 1e-4 || Math.abs(sVel) >= 1e-4);
      const introActive = !reducedMotion && !introDone;

      if (introActive || springActive) {
        rafId = window.requestAnimationFrame(renderFrame);
      } else {
        lastTime = 0;
      }
    };

    const wakeLoop = () => {
      if (destroyed || rafId) return;
      lastTime = 0;
      rafId = window.requestAnimationFrame(renderFrame);
    };

    // Initial Frame 1 geometry & URLs
    const vw = geom.W;
    const vh = geom.H;
    const streetW = pickProxyWidth(Math.max(vw, vh * 1.26 * 1.506), 2048);
    const facadeW = pickProxyWidth(Math.max(vw, vh * 1.5), 2496);
    const bandW = pickProxyWidth(vw, 2496);

    const dayUrl = buildProxyUrl(SOURCE_URLS.day, streetW);
    const nightUrl = buildProxyUrl(SOURCE_URLS.night, streetW);
    const facadeUrl = buildProxyUrl(SOURCE_URLS.facade, facadeW);
    const bandUrl = buildProxyUrl(SOURCE_URLS.band, bandW);

    // Paint facade immediately for Frame 1
    facadeLeftImg.src = facadeUrl;
    facadeRightImg.src = facadeUrl;
    bandEl.style.backgroundImage = `url("${bandUrl}")`;
    bandEl.style.transform = `translate3d(0, ${1.02 * geom.H}px, 0)`;
    worldDayEl.src = dayUrl;
    worldNightEl.src = nightUrl;

    applyStaticGeometry(geom);

    if (reducedMotion) {
      halfLeftEl.style.display = 'none';
      halfRightEl.style.display = 'none';
    }

    const activatePlatesFallback = () => {
      if (destroyed || mode === 'webgl' || mode === 'canvas2d') return;
      mode = 'plates';
      introDone = true;
      worldEl.classList.add('is-active');
      layersEl.style.display = 'none';
      halfLeftEl.style.display = 'none';
      halfRightEl.style.display = 'none';
      wakeLoop();
    };

    // 9s fallback timeout per section 6.3
    fallbackTimer = window.setTimeout(activatePlatesFallback, 9000);

    // Load all four images + fonts before starting intro
    Promise.all([
      loadImage(dayUrl),
      loadImage(nightUrl),
      loadImage(facadeUrl),
      loadImage(bandUrl),
      document.fonts ? document.fonts.ready : Promise.resolve(),
    ])
      .then(([dayImg, nightImg]) => {
        if (destroyed || mode === 'plates') return;
        window.clearTimeout(fallbackTimer);
        loadedDayImg = dayImg;
        loadedNightImg = nightImg;

        const glBuilt = buildGLState(layersEl, dayImg, nightImg);
        if (glBuilt) {
          glState = glBuilt;
          mode = 'webgl';
          applyStaticGeometry(geom);
        } else {
          buildCanvas2DFallback(dayImg, nightImg);
        }

        readyAt = performance.now();
        wakeLoop();
      })
      .catch(() => {
        window.clearTimeout(fallbackTimer);
        activatePlatesFallback();
      });

    const onScroll = () => {
      wakeLoop();
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (destroyed) return;
        geom = computeGeometry();
        applyStaticGeometry(geom);
        wakeLoop();
      }, 120);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      destroyed = true;
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(resizeTimer);
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (glState) {
        const { gl } = glState;
        gl.deleteTexture(glState.dayTex);
        gl.deleteTexture(glState.nightTex);
        gl.deleteProgram(glState.program);
      }
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    if (targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="track" ref={trackRef}>
      <main className="hero" ref={heroRef}>
        <div className="world" ref={worldRef} aria-hidden="true">
          <img
            ref={worldDayRef}
            alt="Havana colonial street in daylight"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <img
            ref={worldNightRef}
            alt="Havana colonial street illuminated at night"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            style={{ opacity: 0 }}
          />
        </div>

        <div id="layers" ref={layersRef} aria-hidden="true" />

        <div className="band" ref={bandRef}>
          <h1 className="title" ref={titleRef}>
            NOCHE VIVA
          </h1>
        </div>

        <div className="half l" ref={halfLeftRef} aria-hidden="true">
          <img
            ref={facadeLeftImgRef}
            alt=""
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="half r" ref={halfRightRef} aria-hidden="true">
          <img
            ref={facadeRightImgRef}
            alt=""
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </div>

        <nav className="hero-nav" aria-label="Primary navigation">
          <div className="nav-group">
            <a
              href="#villas"
              className="nav-link"
              onClick={(e) => handleNavClick(e, 'villas')}
            >
              plazas
            </a>
            <a
              href="#villas"
              className="nav-link"
              onClick={(e) => handleNavClick(e, 'villas')}
            >
              music
            </a>
            <a
              href="#advisory"
              className="nav-link"
              onClick={(e) => handleNavClick(e, 'advisory')}
            >
              rum
            </a>
          </div>

          <a
            href="#"
            className="nav-logo"
            aria-label="Noche Viva home"
            onClick={(e) => handleNavClick(e, 'top')}
          >
            <svg viewBox="0 0 44 50" fill="currentColor" aria-hidden="true">
              <path d="M4 50V20C4 9 12 2 22 2s18 7 18 18v30h-7V20c0-6.6-4.9-11-11-11S11 13.4 11 20v30z" />
              <circle cx="22" cy="24" r="5.5" />
              <path d="M16 50V36h12v14h-4.5v-9.5h-3V50z" />
            </svg>
          </a>

          <div className="nav-group">
            <a
              href="#villas"
              className="nav-link"
              onClick={(e) => handleNavClick(e, 'villas')}
            >
              stays
            </a>
            <a
              href="#advisory"
              className="nav-link"
              onClick={(e) => handleNavClick(e, 'advisory')}
            >
              journal
            </a>
            <a
              href="#contact"
              className="nav-link"
              onClick={(e) => handleNavClick(e, 'contact')}
            >
              contact
            </a>
          </div>
        </nav>
      </main>
    </div>
  );
};
