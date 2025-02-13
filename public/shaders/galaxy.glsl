precision highp float;

uniform float iTime;
uniform vec3 iResolution;

#define PI 3.1415926535

// Rotation matrix
mat2 Rotate(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c);
}

// Random function for stars
float RandFloat(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

// Stylized star shape
float Star(vec2 uv, float shine, float size) {
    uv /= 2.0 * size;
    float d = length(uv);
    
    float x = abs(uv.x);
    float y = abs(uv.y);
    float m = max(0.0, 1.0 - (x * y * 1000.0));
    m *= shine;
    
    uv *= Rotate(PI / 4.0);
    x = abs(uv.x);
    y = abs(uv.y);
    float r = max(0.0, 1.0 - (x * y * 1000.0));
    r *= shine;
    
    m *= smoothstep(1.0, 0.01, d);
    r *= smoothstep(1.0, 0.1, d);
    
    return r + m + (0.02 / d);
}

// Nebula noise function
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    
    float a = RandFloat(i);
    float b = RandFloat(i + vec2(1.0, 0.0));
    float c = RandFloat(i + vec2(0.0, 1.0));
    float d = RandFloat(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// FBM for nebula
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
        value += amplitude * noise(st * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return smoothstep(0.0, 1.0, value);
}

// Color palette
vec3 palette(float t) {
    vec3 a = vec3(0.8, 0.5, 0.4);
    vec3 b = vec3(0.2, 0.4, 0.2);
    vec3 c = vec3(2.0, 1.0, 1.0);
    vec3 d = vec3(0.00, 0.25, 0.25);
    return a + b * cos(3.14159 * 2.0 * (c * t + d));
}

// Nebula effect
vec3 nebula(vec2 uv) {
    float zoom = 1.5;
    vec2 movement = vec2(-iTime * 0.02, -iTime * 0.015);
    
    float f = fbm(uv * zoom + movement);
    f += fbm(uv * zoom * 2.0 + movement * 1.2) * 0.5;
    
    vec3 color1 = palette(f + iTime * 0.1);
    vec3 color2 = palette(f + iTime * 0.1 + 0.33);
    return mix(color1, color2, f) * f * 0.5;
}

// Star field generation
vec3 SpawnStars(vec2 uv) {
    vec3 col = vec3(0.0);
    vec2 gv = fract(uv) - 0.5;
    vec2 id = floor(uv);
    
    for(int y = -1; y <= 1; y++) {
        for(int x = -1; x <= 1; x++) {
            vec2 offs = vec2(x, y);
            float n = RandFloat(id + offs);
            float size = fract(n * 345.32);
            
            float star = Star(gv - offs - vec2(n, fract(n * 34.0)) + 0.5, 
                            smoothstep(0.9, 1.0, size), size * 0.6);
            
            vec3 color = sin(vec3(0.2, 0.3, 0.9) * fract(n * 2345.2) * 123.2) * 0.5 + 0.5;
            color = color * vec3(1.0, 0.25, 1.0 + size) + vec3(0.2, 0.2, 0.1) * 2.0;
            
            star *= sin(iTime * 3.0 + n * 6.2831) * 0.5 + 1.0;
            col += star * size * color * 0.3; // Reduced star brightness
        }
    }
    return col;
}

void main() {
    // Adjust UV coordinates to fill screen
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    
    float t = iTime * 0.02;
    uv *= Rotate(-t * 0.5);
    
    vec3 color = vec3(0.0);
    
    // Add rotating star layers with forward movement
    for(float i = 0.0; i < 1.0; i += 1.0/3.0) {
        float depth = fract(i + t);
        float scale = mix(0.5, 20.0, depth);
        float fade = depth * smoothstep(0.0, 0.1, depth);
        color += SpawnStars(uv * scale + i * 453.2) * fade;
    }
    
    // Add nebula with forward movement
    vec2 nebulaUV = uv * (1.0 + t * 0.03);
    color += nebula(nebulaUV) * 0.8;
    
    // Enhance contrast and add vignette
    float vignette = smoothstep(1.8, 0.3, length(uv * 0.5)); // Adjusted vignette for wider view
    color *= vignette;
    
    color = pow(color, vec3(0.8));
    
    gl_FragColor = vec4(color, 1.0);
}
