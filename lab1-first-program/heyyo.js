main();
function main() {
    /* Creating Canvas Element. The reason I created the object here because
    I use VSCode as code editor and if I am not do so it can't autocomplete.
    */
    var canvas = document.createElement('canvas')
    canvas.setAttribute("width", '512');
    canvas.setAttribute("height", '512');
    document.querySelector('#canvas_div').appendChild(canvas);

    // Initialize the GL context
    const gl = canvas.getContext("webgl");
    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not supportit.");
        return;
    }
    //Vertex shader creation and compilation
    var vertShdr;
    //VERTEX_SHADER_DOCUMENT from vertex_shader.glsl
    // I use glsl extension for syntax highlighting issues
    vertShdr = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShdr, VERTEX_SHADER_DOCUMENT);
    gl.compileShader(vertShdr);
    if (!gl.getShaderParameter(vertShdr,
        gl.COMPILE_STATUS)) {
        alert("Vertex shader failed to compile!");
        return -1;
    }

    //Fragment shader creation and compilation
    var fragShdr;
    //FRAGMENT_SHADER_DOCUMENT from fragment_shader.glsl
    // I use glsl extension for syntax highlighting issues
    fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShdr, FRAGMENT_SHADER_DOCUMENT);
    gl.compileShader(fragShdr);
    if (!gl.getShaderParameter(fragShdr,
        gl.COMPILE_STATUS)) {
        alert("Fragment shader failed tocompile!");
        return -1;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertShdr);
    gl.attachShader(program, fragShdr);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program,
        gl.LINK_STATUS)) {
        alert("Shader program failed tolink!");
        return -1;
    }

    gl.useProgram(program);

    var vertices = new Float32Array(
        [
            -1, -1,
            1, -1,
            0, 1
        ]);
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.clearColor(0.5, 0.3, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 3)

}