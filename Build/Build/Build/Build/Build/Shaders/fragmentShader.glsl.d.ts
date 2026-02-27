declare const fragmentShader = "\nuniform vec3 color;\nuniform sampler2D pointTexture;\nuniform float alphaTest;\n\nvarying vec3 vColor;\n\nvoid main() {\n    gl_FragColor = vec4( color * vColor, 1.0 );\n    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );\n    if ( gl_FragColor.a < alphaTest ) discard;\n}\n";
export { fragmentShader };
