declare const vertexShader = "\nattribute float size;\nattribute vec3 customColor;\n\nvarying vec3 vColor;\n\nvoid main() {\n    vColor = customColor;\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    gl_PointSize = size * ( 300.0 / -mvPosition.z );\n    gl_Position = projectionMatrix * mvPosition;\n}\n";
export { vertexShader };
