var gl, theta = 0,
	thetaLoc, mycolor_loc, translate_loc, scale_loc,
	isDirClockwise = false,
	delay = 100,
	myColor = [173 / 255, 98 / 255, 198 / 255],
	scale_factor = 1,
	translate_factor = [0, 0],
	translate_acceralator = 0.1,
	direction = 1,
	toggleRotation = false;



window.onload = function main() {
	const canvas = document.querySelector("#glcanvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser or machine may not supportit.");
		return;
	}
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);


	//BUTTON EVENTS
	//Toggle Rotation
	document.getElementById("toggleRotation").onmousedown = toggleRotation_func;
	//Change Direction
	document.getElementById("changeDirection").onmousedown = changeDirection;
	//reset
	document.getElementById("reset").onclick = reset;

	//color
	document.getElementById("color_input").oninput = color_input_func;

	//slider event
	document.getElementById("rotate").oninput = rotate;

	//keydown event
	window.onkeydown = move;

	//mouse event
	window.onwheel = scale;

	//menu event
	document.getElementById("mymenu").onclick = optionMenuSelect;



	var vertices = [
		vec2(-.9, -.8),
		vec2(-.9, .8),
		vec2(-.7, .8),
		vec2(-.7, -.8),

		vec2(-.7, .8),
		vec2(-.7, .6),
		vec2(-.2, .6),
		vec2(-.2, .8),

		vec2(-.7, .1),
		vec2(-.7, -.1),
		vec2(-.4, -.1),
		vec2(-.4, .1),

		vec2(-.7, -.6),
		vec2(-.7, -.8),
		vec2(-.2, -.8),
		vec2(-.2, -.6),




		vec2(.1, .8),
		vec2(.1, -.8),
		vec2(.3, -.8),
		vec2(.3, .8),

		vec2(.3, .8),
		vec2(.3, .6),
		vec2(.8, .6),
		vec2(.8, .8),

		vec2(.6, .6),
		vec2(.8, .6),
		vec2(.8, .1),
		vec2(.6, .1),

		vec2(.3, .2),
		vec2(.3, .0),
		vec2(.8, -.0),
		vec2(.8, .2),

		vec2(.35, .2),
		vec2(.2, .0),
		vec2(.65, -.8),
		vec2(.78, -.6),

		vec2(.65, -.8),
		vec2(.78, -.6),
		vec2(.88, -.8),

	];

	var bufferId = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);


	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	//get uniform locations
	thetaLoc = gl.getUniformLocation(program, "theta");
	mycolor_loc = gl.getUniformLocation(program, "mycolor");
	translate_loc = gl.getUniformLocation(program, "translate");
	scale_loc = gl.getUniformLocation(program, "scale");

	gl.clearColor(.8, .8, .8, 1.0);
	render();

};

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	editTheta();

	gl.uniform1f(thetaLoc, theta);
	gl.uniform3fv(mycolor_loc, myColor);
	gl.uniform2fv(translate_loc, translate_factor);
	gl.uniform1f(scale_loc, scale_factor);

	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);


	gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 24, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 28, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 32, 4);
	gl.drawArrays(gl.TRIANGLES, 36, 3);

	setTimeout(
		function () {
			requestAnimFrame(render);
		}, delay
	);

}
function editTheta() {
	if(toggleRotation){
		theta += (Math.PI/180)*direction;
	}
 }

function scale(event) {
	if (event.deltaY < 0)
		scale_factor = scale_factor + 0.1;
	else
		scale_factor = (scale_factor - 0.1) <= 0.1 ? 0.1 : (scale_factor - 0.1);
}

function move(event) {
	var key = String.fromCharCode(event.keyCode).toUpperCase();
	switch (key) {
		case 'W':
			translate_factor[1] += translate_acceralator;
			break;
		case 'A':
			translate_factor[0] -= translate_acceralator;
			break;
		case 'S':
			translate_factor[1] -= translate_acceralator;
			break;
		case 'D':
			translate_factor[0] += translate_acceralator;
			break;
	}
};

function rotate(event) {
	theta = -1 * (event.target.value * (Math.PI / 180));
};

function toggleRotation_func(event) {
	if (toggleRotation) {
		toggleRotation = false;
		event.target.innerText = 'Start Rotation';
	}
	else {
		toggleRotation = true;
		event.target.innerText = 'Stop Rotation';
	}
}

function changeDirection(event) {
	if (toggleRotation) {
		if (direction == 1) {
			direction = -1;
			event.target.innerText = "Rotate AntiClockwise";
		}
		else {
			direction = 1;
			event.target.innerText = "Rotate Clockwise";
		}
	}
}

function optionMenuSelect(event) {
	switch (event.target.value) {
		case '0':
			delay /= 2;
			break;
		case '1':
			delay *= 2;
			break;
	}
}

function color_input_func(event) {
	const r = parseInt(event.target.value.substr(1, 2), 16);
	const g = parseInt(event.target.value.substr(3, 2), 16);
	const b = parseInt(event.target.value.substr(5, 2), 16);
	myColor = [r / 255, g / 255, b / 255];
}
function reset() {
	document.getElementById("toggleRotation").innerText = "Start Rotation";
	document.getElementById("changeDirection").innerText = "Rotate Clockwise";
	document.getElementById("rotate").value = "0";
	document.getElementById("color_input").value = "#AD62C6";
	isDirClockwise = false;
	delay = 100;
	myColor = [173 / 255, 98 / 255, 198 / 255];
	scale_factor = 1;
	translate_factor = [0, 0];
	translate_acceralator = 0.1;
	direction = 1;
	theta = 0;
	toggleRotation = false;

}
