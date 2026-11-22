import { drawGrid } from '@soundor/components/chart';
import { defaultTheme } from '@soundor/components/theme';
import type { UiNode } from 'soundor:ui';

import { echoFieldY, voices } from './model';

const colors = defaultTheme.color;
const palette = voices.map((voice) => colors[voice]);
const gridViewport = {
  left: 24,
  top: 38,
  width: 704,
  height: echoFieldY.baseline - 38,
};
const verticalGrid = Array.from({ length: 9 }, (_, i) => 46 + i * 82.5);
const horizontalGrid = [42, 82, 122, 162];

function shaderColor(color: string) {
  const rgb = Number.parseInt(color.slice(1), 16);
  return `vec3(${[16, 8, 0].map((shift) => (((rgb >> shift) & 255) / 255).toFixed(6)).join(',')})`;
}

export interface FieldState {
  times: readonly number[];
  levels: readonly number[];
  feedback: number;
  motion: number;
  hold: boolean;
  bypass: boolean;
  playing: boolean;
}

const vertex = `#version 300 es
in vec2 position;
out vec2 uv;
void main() { uv = position * .5 + .5; gl_Position = vec4(position, 0., 1.); }`;

// A parameter map, not an audio analyser. Each colored ridge belongs to one tap.
const fragment = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 color;
uniform vec3 taps, levels;
uniform float clock, feedback, motion, bypass;
float line(float d, float width) { return 1. - smoothstep(width, width * 2., abs(d)); }
void main() {
  vec2 p = vec2(uv.x * 752., (1. - uv.y) * ${echoFieldY.height}.);
  vec3 c = ${shaderColor(colors.display)};
  float grid = max(line(mod(p.x - 46. + 82.5, 82.5), .35), line(mod(p.y - 18. + 40., 40.), .35));
  float baseline = ${echoFieldY.baseline}.;
  c = mix(c, ${shaderColor(colors.displayGrid)}, grid);
  c = mix(c, ${shaderColor(colors.displayAxis)}, line(p.y - baseline, .45));
  vec3 palette[3] = vec3[3](${palette.map(shaderColor).join(',')});
  for (int i = 0; i < 3; i++) {
    float center = 46. + taps[i] / 3. * 660.;
    float amplitude = levels[i] * ${echoFieldY.levelTravel}.;
    float envelope = exp(-pow((p.x - center) / (60. + feedback * 55.), 2.));
    float oscillation = .68 + .32 * cos((p.x - center) * .085 + sin(clock * .7 + float(i)) * motion * 2.);
    float ridge = baseline - envelope * amplitude * oscillation;
    vec3 ink = mix(palette[i], ${shaderColor(colors.displayMuted)}, bypass);
    float stroke = line(p.y - ridge, .6);
    float fill = step(ridge, p.y) * step(p.y, baseline) * envelope * .042;
    c = mix(c, ink, (stroke * .75 * max(.06, envelope) + fill) * (1. - bypass * .55));
    // Fainter returns make feedback legible without inventing a live waveform.
    for (int j = 1; j < 4; j++) {
      float returnX = center + float(j) * 76.;
      float e = exp(-pow((p.x - returnX) / 24., 2.));
      float y = baseline - e * amplitude * pow(feedback, float(j)) * .55;
      c = mix(c, ink, line(p.y - y, .45) * pow(feedback, float(j)) * e * .15 * (1. - bypass * .55));
    }
  }
  color = vec4(c, 1.);
}`;

export interface FieldRenderer {
  draw(state: FieldState, seconds: number): void;
  dispose(): void;
}

export function createFieldRenderer(
  canvas: UiNode,
  force2d = false,
): FieldRenderer {
  const gl = force2d
    ? null
    : canvas.getContext('webgl2', { alpha: false, antialias: false });
  if (!gl) return fallback(canvas);
  const shaders: WebGLShader[] = [];
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const vao = gl.createVertexArray();
  const dispose = () => {
    shaders.forEach((shader) => gl.deleteShader(shader));
    gl.deleteBuffer(buffer);
    gl.deleteVertexArray(vao);
    gl.deleteProgram(program);
  };
  try {
    if (!program || !buffer || !vao)
      throw new Error('Could not allocate the echo display');
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertex],
      [gl.FRAGMENT_SHADER, fragment],
    ] as const) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Could not allocate an echo shader');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(shader) ?? 'Echo shader failed');
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(program) ?? 'Echo program failed');
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniform = Object.fromEntries(
      ['taps', 'levels', 'clock', 'feedback', 'motion', 'bypass'].map(
        (name) => [name, gl.getUniformLocation(program, name)],
      ),
    );
    return {
      draw(state, seconds) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);
        gl.bindVertexArray(vao);
        gl.uniform3f(
          uniform.taps!,
          state.times[0]!,
          state.times[1]!,
          state.times[2]!,
        );
        gl.uniform3f(
          uniform.levels!,
          state.levels[0]!,
          state.levels[1]!,
          state.levels[2]!,
        );
        gl.uniform1f(
          uniform.clock!,
          state.playing && !state.bypass ? seconds : 0,
        );
        gl.uniform1f(uniform.feedback!, state.feedback);
        gl.uniform1f(uniform.motion!, state.motion);
        gl.uniform1f(uniform.bypass!, Number(state.bypass));
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
      dispose,
    };
  } catch (error) {
    dispose();
    // A separate canvas can take a 2D context after this WebGL one fails.
    throw error;
  }
}

function fallback(canvas: UiNode): FieldRenderer {
  const ctx = canvas.getContext('2d');
  return {
    draw(state, seconds) {
      if (!ctx) return;
      ctx.setTransform(
        canvas.width / 752,
        0,
        0,
        canvas.height / echoFieldY.height,
        0,
        0,
      );
      ctx.fillStyle = colors.display;
      ctx.fillRect(0, 0, 752, echoFieldY.height);
      drawGrid(
        ctx,
        gridViewport,
        verticalGrid,
        horizontalGrid,
        colors.displayGrid,
      );
      drawGrid(
        ctx,
        gridViewport,
        [],
        [echoFieldY.baseline],
        colors.displayAxis,
      );
      ctx.globalAlpha = state.bypass ? 0.45 : 1;
      palette.forEach((color, i) => {
        ctx.strokeStyle = state.bypass ? colors.displayMuted : color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 24; x <= 728; x += 2) {
          const center = 46 + (state.times[i]! / 3) * 660;
          const envelope = Math.exp(
            -(((x - center) / (60 + state.feedback * 55)) ** 2),
          );
          const y =
            echoFieldY.baseline -
            envelope *
              state.levels[i]! *
              echoFieldY.levelTravel *
              (0.68 +
                0.32 *
                  Math.cos(
                    (x - center) * 0.085 +
                      Math.sin(
                        (state.playing && !state.bypass ? seconds : 0) * 0.7 +
                          i,
                      ) *
                        state.motion *
                        2,
                  ));
          if (x === 24) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    },
    dispose() {},
  };
}
