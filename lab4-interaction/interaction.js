var gl, theta, thetaLoc;
var isDirClockwise = false;
var delay = 100;


function changeDirection() {
    isDirClockwise = !isDirClockwise;
}
function speedUp() {
    delay /= 2.0
}
function speedDown() {
    delay *= 2.0
}

function buttonPressFunc(event) {
    changeDirection();
}
function xToCanvasX(canvas, x) {
    return (-1 + 2 * x / canvas.width);
}
function yToCanvasY(canvas, y) {
    return (-1 + 2 * (canvas.height - y) / canvas.height);
}

var menu = document.getElementById("mymenu");

function optionMenuSelect(event) {
    console.log(event);
    switch (menu.selectedIndex) {
        case 0:
            changeDirection();
            break;
        case 1:
            speedUp();
            break;
        case 2:
            speedDown();
            break;
    }
}

window.onload = function main() {
    const canvas = document.querySelector("#glcanvas");
    // Initialize the GL context
    gl = WebGLUtils.setupWebGL(canvas);

    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not supportit.");
        return;
    }
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    //initShaders( gl, vertexShaderId, fragmentShaderId )
    gl.useProgram(program);



    //accessing the web page button and defining the callback function
    document.getElementById("DirectionButton").addEventListener('mousedown', buttonPressFunc);
    //document.getElementById("DirectionButton").onclick = buttonPressFunc;
    //document.getElementById("DirectionButton").onclick =  () => { changeDirection(); };

    //slider event
    document.getElementById("slide").onchange =
        function () { delay = 1000/this.value; };

    //keydown event
    window.onkeydown =
        function (event) {
            var key =
                String.fromCharCode(event.keyCode);
            switch (key) {
                case '1':
                    changeDirection();
                    break;
                case '2':
                    speedUp();
                    break;
                case '3':
                    speedDown();
                    break;
            }
        };



    //accesing the option menu
    menu.addEventListener("click", optionMenuSelect);

    //initial square points
    var vertices = [
        vec2(-.6, -.6),//bottom left corner
        vec2(.6, -.6),//bottom right corner
        vec2(.6, .6),//top right corner
        vec2(-.6, .6)//top left corner
    ];

    //canvas click event
    var bufferId = gl.createBuffer();


    var index = 0;

    canvas.addEventListener("click", function (event) {
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        var t = vec2(xToCanvasX(canvas, event.clientX), yToCanvasY(canvas, event.clientY));
        gl.bufferSubData(gl.ARRAY_BUFFER,
            sizeof['vec2'] * index,
            flatten(t));
        index++;
    });
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

    gl.clearColor(.8, .8, .8, 1.0);
    render();

};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    var deg = 0.1;//(Math.PI / 180);
    theta += (isDirClockwise ? (1 * deg) : -(1 * deg));
    gl.uniform1f(thetaLoc, theta);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    setTimeout(
        function () { requestAnimFrame(render); }, delay
    );
    //requestAnimFrame(render);

}