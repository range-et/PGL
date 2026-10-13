const fragmentShader = `
uniform vec3 color;
uniform sampler2D pointTexture;
uniform float alpha;

varying vec3 vColor;

void main() {
    gl_FragColor = vec4( color * vColor, alpha );
    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
    // colors are linear (THREE.Color); convert to the renderer's output color space
    #include <colorspace_fragment>
}
`;

export { fragmentShader };
