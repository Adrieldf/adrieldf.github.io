precision highp float;

uniform float time;
uniform vec2 resolution;

// Function to create random values based on a position
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Function to create a starfield
float starField(vec2 uv) {
    uv *= 100.0; // Scale up the UVs to create more stars
    vec2 id = floor(uv); // Get the grid cell id
    vec2 offset = fract(uv); // Get the local offset inside the cell

    float star = smoothstep(0.0, 0.02, random(id) - length(offset - 0.5));
    return star;
}

void main() {
    // Normalize the UV coordinates
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    // Add motion to the galaxy (simulate camera movement)
    vec2 motion = vec2(time * 0.05, time * 0.03);
    vec2 starUV = uv + motion;

    // Accumulate star layers for a dense galaxy effect
    float stars = 0.0;
    stars += starField(starUV * 1.0);
    stars += starField(starUV * 2.0) * 0.5;
    stars += starField(starUV * 4.0) * 0.25;

    // Colorize the stars
    vec3 color = vec3(stars);
    color.r += stars * 0.5;
    color.b += stars * 0.8;

    gl_FragColor = vec4(color, 1.0);
}
