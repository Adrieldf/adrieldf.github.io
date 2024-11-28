#ifdef GL_ES
precision highp float;
#endif

uniform float iTime; // Elapsed time
uniform vec3 iResolution; // Screen resolution (width, height, and depth)

// Function to calculate the Mandelbrot set
int mandelbrot(vec2 c) {
    vec2 z = c;
    int i;
    for (i = 0; i < 100; i++) {
        if (length(z) > 2.0) break;
        z = vec2(
            z.x * z.x - z.y * z.y + c.x,
            2.0 * z.x * z.y + c.y
        );
    }
    return i;
}

void main() {
    // Normalize the screen coordinates to range [-1, 1]
    vec2 uv = gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y; // Adjust aspect ratio

    // Scale the UV to zoom in and out
    uv *= 1.5;

    // Shift the view to explore different parts of the fractal
    uv += vec2(sin(iTime) * 0.5, cos(iTime) * 0.5);

    // Mandelbrot set computation
    int maxIter = 100;
    int iter = mandelbrot(uv);

    // Color the fractal based on the number of iterations
    float color = float(iter) / float(maxIter);
    vec3 col = vec3(0.0, 0.0, 1.0 - color);

    gl_FragColor = vec4(col, 1.0);
}
