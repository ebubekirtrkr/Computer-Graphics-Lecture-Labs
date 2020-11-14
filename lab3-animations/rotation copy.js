var gl, theta, thetaLoc;
var delay = 1000 / 20;
window.onload = function main() {
    const canvas = document.querySelector("#glcanvas");
    // Initialize the GL context

    gl = canvas.getContext("webgl");
    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not supportit.");
        return;
    }
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    //initShaders( gl, vertexShaderId, fragmentShaderId )
    gl.useProgram(program);

    //initial square points
    var vertices = [
        vec2(-.6, -.6),//bottom left corner
        vec2(.6, -.6),//bottom right corner
        vec2(.6, .6),//top right corner
        vec2(-.6, .6)//top left corner
    ];

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)//it chnage only state
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);//change to points
    // flatten ile points a type veriyoz

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //get uniform location
    thetaLoc = gl.getUniformLocation(program, "theta");
    theta = 0;
    gl.uniform1f(thetaLoc, theta);
    /*
    uniform1f
    name = uniform
    dimension = 1, how many parameter we are sending
    type = f float (etc. i for int)
    also ve can use v to send as paramaters array
        etc uniform1fv
    also we need to specify first paramater as location
    */

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    render();
    //setInterval(render,1000/20);

};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    theta += 0.1;
    gl.uniform1f(thetaLoc, theta);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    setTimeout(
        function () { requestAnimFrame(render); },delay
    );
    /*
    TRIANGLE_FAN
    LINE_LOOP
    */
}