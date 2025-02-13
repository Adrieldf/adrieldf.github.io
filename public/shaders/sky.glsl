precision highp float;

uniform float iTime;
uniform vec3 iResolution;

// Improved noise function for more defined clouds
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    // Sharper interpolation for cartoon effect
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    
    float a = fract(sin(dot(i, vec2(12.9898, 78.233))) * 43758.5453);
    float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(12.9898, 78.233))) * 43758.5453);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453);
    float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453);
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Modified FBM for more cartoon-like clouds
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    // Fewer layers for more defined shapes
    for(int i = 0; i < 3; i++) {
        value += amplitude * noise(st * frequency);
        st += st * 1.1;
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    
    // Make clouds more defined
    return smoothstep(0.0, 1.0, value);
}

// Cartoon cloud function
vec4 renderClouds(vec2 uv) {
    // Slower cloud movement
    float cloudSpeed = 0.05; // Reduced from 0.2
    vec2 movement = vec2(iTime * cloudSpeed, 0.0);
    
    // Larger, more defined clouds
    float clouds = fbm(uv * 1.5 + movement);
    clouds += fbm(uv * 3.0 + movement * 1.2) * 0.5;
    
    // Sharper cloud edges
    clouds = smoothstep(0.4, 0.6, clouds);
    
    // Brighter, more cartoon-like cloud color
    vec3 cloudColor = vec3(1.0, 1.0, 1.0);
    float cloudAlpha = clouds;
    
    // Add subtle shading to clouds
    vec3 shadedCloudColor = mix(
        cloudColor * 0.9,  // Slightly darker for shadow
        cloudColor,        // Full bright for highlights
        clouds
    );
    
    return vec4(shadedCloudColor, cloudAlpha * 0.8);
}

void main() {
    vec2 uv = gl_FragCoord.xy/iResolution.xy;
    
    // Brighter, more cartoon-like sky gradient
    vec3 skyColorTop = vec3(0.4, 0.7, 1.0);    // Brighter blue
    vec3 skyColorBottom = vec3(0.7, 0.9, 1.0);  // Even lighter blue
    vec3 skyColor = mix(skyColorBottom, skyColorTop, pow(uv.y, 0.8)); // Adjusted gradient
    
    // Reduce sky noise for cleaner look
    float skyNoise = noise(uv * 8.0 + iTime * 0.05) * 0.01;
    skyColor += skyNoise;
    
    // Render clouds
    vec4 clouds = renderClouds(uv);
    
    // Sharper cloud mixing
    vec3 finalColor = mix(skyColor, clouds.rgb, clouds.a);
    
    // Lighter vignette
    float vignette = 1.0 - length((uv - 0.5) * 1.8) * 0.2;
    finalColor *= vignette;
    
    gl_FragColor = vec4(finalColor, 1.0);
} 