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
    //VERTEX_SHADER_DOCUMENT from vertex_shader.glsl
    // I use glsl extension for syntax highlighting issues
    var vertShdr = gl.createShader(gl.VERTEX_SHADER);//creating shader
    gl.shaderSource(vertShdr, VERTEX_SHADER_DOCUMENT);//adding source code which loaded before
    gl.compileShader(vertShdr);//compiling shader
    if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) { //checking if compilation is successfull
        alert("Vertex shader failed to compile!");
        return -1;
    }

    //Fragment shader creation and compilation
    //FRAGMENT_SHADER_DOCUMENT from fragment_shader.glsl
    // I use glsl extension for syntax highlighting issues
    var fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShdr, FRAGMENT_SHADER_DOCUMENT);
    gl.compileShader(fragShdr);
    if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
        alert("Fragment shader failed tocompile!");
        return -1;
    }

    var program = gl.createProgram();//create  a shader program
    gl.attachShader(program, vertShdr);//attach vertex shader
    gl.attachShader(program, fragShdr);//attach fragment shader
    gl.linkProgram(program); // link program
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {//check linking status
        alert("Shader program failed tolink!");
        return -1;
    }

    gl.useProgram(program);//use the shader program

    //Let’s draw a triangle


    //1) we initialize Buffers

    var bufferId = gl.createBuffer(); //Create a buffer for the triangle's positions.
    // Select the positionBuffer as the one to apply buffer operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)

    // Now create an array of positions for the triangle
    //Three Vertices
    var vertices = new Float32Array(
        [
            -1, -1,//Corner 1
            1, -1,//Corner 2
            0, 1//Corner 3
        ]);

    // Now pass the list of positions into WebGL to build the shape. We do this by creating a
    // Float32Array from the JavaScript array (vertices), then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    //We create a vertex buffer object (VBO) on the GPU



    //Associating Shader Variables


    var vPosition = gl.getAttribLocation(program, "vPosition");
    /*
    GLint gl.getAttribLocation(program, name);
    The WebGLRenderingContext.getAttribLocation() method of the WebGL API returns the location of an attribute
    variable in a given WebGLProgram.
    */

    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    /*
    void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    The WebGLRenderingContext.vertexAttribPointer() method of the WebGL API binds the buffer currently bound
    to gl.ARRAY_BUFFER to a generic vertex attribute of the current vertex buffer object and specifies its layout.
    */
    //saying what kind of data we are sending
    //in this case 2 dim Float, 2 is for number of components per vertex attribute.

    gl.enableVertexAttribArray(vPosition);
    /*
    void gl.enableVertexAttribArray(index);
    In WebGL, values that apply to a specific vertex are stored in attributes. These are only available to
    the JavaScript code and the vertex shader. Attributes are referenced by an index number into the list
    of attributes maintained by the GPU. Some vertex attribute indices may have predefined purposes, depending
    on the platform and/or the GPU. Others are assigned by the WebGL layer when you create the attributes.
    */


    // Set clear color to black, fully opaque, values between 0.0 and 1.0
    gl.clearColor(0.5, 0.3, 1.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 3)
    /*
    The WebGLRenderingContext.drawArrays() method of the WebGL API renders primitives from array data.
    void gl.drawArrays(mode, first, count);

    mode is like
    gl.POINTS: Draws a single dot.
    gl.LINE_STRIP: Draws a straight line to the next vertex.
    gl.LINE_LOOP: Draws a straight line to the next vertex, and connects the last vertex back to the first.
    gl.LINES: Draws a line between a pair of vertices.
    gl.TRIANGLE_STRIP
    gl.TRIANGLE_FAN
    gl.TRIANGLES: Draws a triangle for a group of three vertices.

    first is specifying the starting index in the array of vector points.
    second is specifying the number of indices to be rendered.
     */

}