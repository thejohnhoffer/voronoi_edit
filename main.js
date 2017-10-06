// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
const VSHADER_SOURCE = `#version 300 es
precision highp float;
in vec4 a_pyramid;

void main() {
  gl_Position = a_pyramid;
}
`;

// Fragment shader program
const FSHADER_SOURCE = `#version 300 es
precision highp float;
out vec4 fragmentColor;

void main() {
  fragmentColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

function getPyramid() {
	// Make the pyramid geometry
  return new Float32Array([
		0.0,  0.0,  0.0,
		1.0,  0.0, -1.0,
    0.0, -1.0, -1.0,
   -1.0,  0.0, -1.0,
    0.0,  1.0, -1.0,
		1.0,  0.0, -1.0,
	])
}

function repeatPoint(n, point) {
  // per point, per pyramid
  var pointSize = point.length;
  var pyramidSize = n*pointSize; 
	// Prepare n copies of the pyramid
	var buffer = new ArrayBuffer(4*pyramidSize);
	var pyramidPoints = new Float32Array(buffer);
  // Write each copy of the pyramid
  for (var v = 0; v < pyramidSize; v+= pointSize) {
		pyramidPoints.set(point, v);
	}
	return pyramidPoints;
}

function setupPyramid(gl, key, values, ND) {
  // Make and bind a buffer
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // Write data to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW);
  // Assign the buffer to the attributes
  gl.vertexAttribPointer(key, ND, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(key);
}

function draw(gl, NV) {
  // Set canvas to clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a point
  gl.drawArrays(gl.TRIANGLE_FAN, 0, NV);
}

function setup(gl, glKeys) {
  // Count vertices and dimensions 
  const onePoint = [0,1,2,3,4,5];
	const NV = onePoint.length;
  const ND = 3;
	var nPoints = 1;
  // Specify the clear color
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Bind the pyramid geometry and indices
	setupPyramid(gl, glKeys.pyramid, getPyramid(), ND);
  //setupPoints(gl, getPoints(nPoints, onePoint), ND)
  // Actually draw
	draw(gl, NV);
}

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');
  // Get the rendering context for WebGL
  var gl = canvas.getContext('webgl2');
  // Compile and bind the shaders
  var program = makeProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE)
  if (program) {
		gl.useProgram(program);
		// Prepare to draw
		var glKeys = {
			'pyramid': gl.getAttribLocation(program, 'a_pyramid'),
			'offset': gl.getAttribLocation(program, 'u_offset'),
		}
		setup(gl, glKeys);
  }
}
