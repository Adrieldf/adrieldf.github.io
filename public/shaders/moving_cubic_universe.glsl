// Moving Cubic Universe Shader

#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec3 p = vec3(uv, 0.0);
  float o = 0.0;
  for(float i = 0.0, z = 0.0, d = 1.0; i < 100.0; i++) { // Initialize d to 1.0 to avoid division by zero
    o += (sin(p.x + u_time) + vec4(0.0, 2.0, 4.0, 0.0).x + 1.3) / d;
    p = z * normalize(vec3(uv, 0.0) * 2.0 - vec3(uv, 0.0).xyy);
    p.xy *= mat2(cos(z * 0.2 + vec4(0.0, 33.0, 11.0, 0.0).x));
    p.z -= u_time + u_time;
    z += d = length(cos(p + cos(p.yzx * 7.0 + u_time))) / 9.0;
  }
  o = tanh(o * o / 4000000.0);
  vec3 color = vec3(o); // Fallback color to ensure visibility
  gl_FragColor = vec4(color, 1.0);
}