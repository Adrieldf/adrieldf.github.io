#ifdef FRAGMENT

precision highp float;

uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

// Generate a random value based on coordinates
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Starfield effect
float starField(vec2 uv, float intensity) {
    vec2 grid = floor(uv * 100.0);
    vec2 offset = fract(uv * 100.0);
    float star = smoothstep(0.9, 1.0, random(grid) + intensity * 0.5 - length(offset - 0.5));
    return star;
}

// Nebula effect using noise
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
        mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
        mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
        u.y
    );
}

// Main nebula coloring
vec3 nebula(vec2 uv) {
    float n = noise(uv * 5.0 + vec2(time * 0.05, time * 0.03));
    return vec3(n * 0.1, n * 0.2, n * 0.5); // Subtle blueish-purple glow
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y; // Correct aspect ratio

    vec3 color = vec3(0.0);

    // Add starfield layers for depth
    color += vec3(starField(uv, 0.5)) * vec3(1.0, 0.9, 0.7);
    color += vec3(starField(uv * 1.5, 0.3)) * vec3(0.8, 0.7, 1.0);
    color += vec3(starField(uv * 2.0, 0.1)) * vec3(1.0, 0.8, 0.5);

    // Add nebula effect
    color += nebula(uv) * 0.5;

    // Add slight vignette effect for focus
    float vignette = smoothstep(1.0, 0.7, length(uv));
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
}

#endif
