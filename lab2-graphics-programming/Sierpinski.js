var gl;
var numPoints = 5000;
/* Creating Canvas Element. The reason I created the object here because
I use VSCode as code editor and if I am not do so it can't autocomplete.
*/

var canvas = document.createElement('canvas')
canvas.setAttribute("width", '512px');
canvas.setAttribute("height", '512px');
document.querySelector('#canvas_div').appendChild(canvas);
window.onload = function main() {


    // Initialize the GL context
    gl = canvas.getContext("webgl");
    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not supportit.");
        return;
    }
    //initShaders different from original, to use glsl I change it so that it can get from glsl files
    var program = initShaders(gl);
    gl.useProgram(program);

    //generating points for Sierpinksi Gasket
    var vertices = [
        vec2(-1.0, -1.0),
        vec2(0.0, 1.0),
        vec2(1.0, -1.0)];
    var u = scale(0.5, add(vertices[0], vertices[1]));
    var v = scale(0.5, add(vertices[0], vertices[2]));
    var p = scale(0.5, add(u, v));
    points = [p];
    for (var i = 1; i < numPoints; ++i) {
        var j = Math.floor(Math.random() * 3);
        p = scale(0.5, add(points[i - 1], vertices[j]));
        points.push(p);
        //points is a flexible so we have to flatten it(typed it)
    }


    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);//change to points
    // flatten ile points a type veriyoz

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    render();

};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, numPoints)
}