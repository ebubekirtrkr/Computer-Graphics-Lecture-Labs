var canvas;
var gl;

var meshVertices = [];
var meshNormals = [];
var meshTexCoords = [];

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var modeLoc, mode = 0;
var lightDirection = vec4(-1, -1, -1, 0.0);


var ambientLight = vec4(0.2, 0.2, 0.2, 1.0);
var ambientColor = vec4(1, 0.8, 4, 1.0);

var lightColor = vec4(1.0, 1.0, 1.0, 1.0);
var diffuseColor = vec4(1, 0.8, 4, 1.0);


var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var specularColor = vec4(1.0, 1.0, 1.0, 1.0);

var materialShininess = 5.0;


window.onload = function init() {
	canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }

	gl.clearColor(0.5, 0.5, 0.5, 1.0);
	gl.enable(gl.DEPTH_TEST);

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	initialize();

	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshVertices), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);


	var nBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshNormals), gl.STATIC_DRAW);

	var vNormal = gl.getAttribLocation(program, "vNormal");
	gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vNormal);

	var tBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshTexCoords), gl.STATIC_DRAW);
	var vTexCoords = gl.getAttribLocation(program, "vTexCoords");
	gl.vertexAttribPointer(vTexCoords, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vTexCoords);

	var texSize = 128;

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, myTexels);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0);


	modelViewMatrix = rotateX(0);
	var x=1.4;
	projectionMatrix = ortho(-x, x, -x, x, -x, x);

	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");


	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

	document.getElementById("ButtonX").onclick = function () {
		modelViewMatrix = mult(rotateX(20), modelViewMatrix);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		render();
	};
	document.getElementById("ButtonY").onclick = function () {
		modelViewMatrix = mult(rotateY(20), modelViewMatrix);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		render();
	};
	document.getElementById("ButtonZ").onclick = function () {
		modelViewMatrix = mult(rotateZ(20), modelViewMatrix);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
		render();
	};
	document.getElementById("mode").onclick = function () {
		changeMode();
		render();
	};
	modeLoc = gl.getUniformLocation(program, "mode");
	gl.uniform1f(modeLoc, mode);
	ambientProduct = mult(ambientLight, ambientColor);
	diffuseProduct = mult(lightColor, diffuseColor);
	specularProduct = mult(lightSpecular, specularColor);


	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
		flatten(ambientProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
		flatten(diffuseProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
		flatten(specularProduct));
	gl.uniform4fv(gl.getUniformLocation(program, "lightDirection"),
		flatten(lightDirection));
	gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

	render();
};
function changeMode() {

	mode = (mode + 1) % 4;
	var element = document.getElementById("modeText")
	if (mode == 0)
		element.innerText = "phong with with texture"
	else if (mode == 1)
		element.innerText = "only texture"
	else if (mode == 2)
		element.innerText = "only phong"
	else if (mode == 3)
		element.innerText = "wireframe"

	gl.uniform1f(modeLoc, mode);
}
function initialize() {
	for (var i = 0; i < quads.length; i += 12) {
		addTriangleVertexForIndices(quads[i] - 1, quads[i + 1] - 1, quads[i + 2] - 1);
		addTriangleVertexForIndices(quads[i + 3] - 1, quads[i + 4] - 1, quads[i + 5] - 1);
		addTriangleVertexForIndices(quads[i + 6] - 1, quads[i + 7] - 1, quads[i + 8] - 1);

		addTriangleVertexForIndices(quads[i] - 1, quads[i + 1] - 1, quads[i + 2] - 1);
		addTriangleVertexForIndices(quads[i + 6] - 1, quads[i + 7] - 1, quads[i + 8] - 1);
		addTriangleVertexForIndices(quads[i + 9] - 1, quads[i + 10] - 1, quads[i + 11] - 1);
	}
	for (var i = 0; i < triangles.length; i += 9) {
		addTriangleVertexForIndices(triangles[i] - 1, triangles[i + 1] - 1, triangles[i + 2] - 1);
		addTriangleVertexForIndices(triangles[i + 3] - 1, triangles[i + 4] - 1, triangles[i + 5] - 1);
		addTriangleVertexForIndices(triangles[i + 6] - 1, triangles[i + 7] - 1, triangles[i + 8] - 1);
	}
}

function addTriangleVertexForIndices(vIndex, tIndex, nIndex) {
	meshVertices.push(vertices[3 * vIndex], vertices[3 * vIndex + 1], vertices[3 * vIndex + 2]);
	meshTexCoords.push(textureCoords[2 * tIndex], textureCoords[2 * tIndex + 1]);
	meshNormals.push(normals[3 * nIndex], normals[3 * nIndex + 1], normals[3 * nIndex + 2]);
}
function render() {

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	if (mode == 3)
		gl.drawArrays(gl.LINE_LOOP, 0, (meshVertices.length) / 3);
	else
		gl.drawArrays(gl.TRIANGLES, 0, (meshVertices.length) / 3);

}
