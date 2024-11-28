#ifdef GL_ES
precision highp float;
#endif

uniform float iTime;
uniform vec3 iResolution;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    
    // Simple color changing effect based on time
    vec3 color1 = vec3(0.0, 0.5, 1.0); // Blue
    vec3 color2 = vec3(1.0, 0.5, 0.0); // Orange

    // Mix the colors based on sine wave of time
    vec3 color = mix(color1, color2, 0.5 + 0.5 * sin(iTime));

    gl_FragColor = vec4(color, 1.0);
}
