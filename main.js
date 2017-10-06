// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
const VSHADER_SOURCE = `
attribute vec4 a_offset;
attribute vec4 a_pyramid;

void main() {
  gl_Position = a_pyramid + a_offset;
}
`;

// Fragment shader program
const FSHADER_SOURCE = `
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

function getOffset(gl, points) {
	// Return dummy offsets
  var values = new Float32Array([
		0.0,  0.0, -1.0,
    0.0,  1.0, -1.1,
    0.0, -1.0, -1.8,
	]);
	return {
		values: values,
		usage: gl.DYNAMIC_DRAW,	
	};
}

function getPyramid(gl) {
	// Make the pyramid geometry
  var values = new Float32Array([
		0.0,  0.0,  0.0,
		1.0,  0.0, -1.0,
    0.0, -1.0, -1.0,
   -1.0,  0.0, -1.0,
    0.0,  1.0, -1.0,
		1.0,  0.0, -1.0,
	]);
	return {
		values: values,
		usage: gl.STATIC_DRAW,		
	};
}

function updateBuffer(gl, state) {
	// Select and write to the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, state.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, state.values, gl.STATIC_DRAW);
}

function bindBuffer(gl, key, bufferSource, ND) {
  // Make and define bind a buffer
	var size = values.length;
  var buffer = gl.createBuffer();
	var bufferState = {
		'key': key,
		'buffer': buffer,
		'count': size / ND,
		'usage': bufferSource.usage,
		'values': bufferSource.values,
	};
	// Update the buffer with values
	updateBuffer(gl, bufferState);
  // Assign the buffer to the attributes
  gl.vertexAttribPointer(key, ND, gl.FLOAT, false, 4*ND, 0);
  gl.enableVertexAttribArray(key);
  return bufferState;
}

function draw(gl, offset, pyramid) {
	// Get instanced array extension
  var ext = gl.getExtension('ANGLE_instanced_arrays');
  // Set canvas to clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

	// Apply each offset to a pyramid instance
	ext.vertexAttribDivisorANGLE(offset.key, 1);
	ext.drawArraysInstancedANGLE(gl.TRIANGLE_FAN, 0, pyramid.count, offset.count);
}

function setup(gl, glKeys) {
  // Count vertices and dimensions 
	const NCopy = 3;
  const ND = 3;
	var nPoints = 1;
  // Specify the clear color
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Make the Pyramid and initial offsets
	var pyramidSource = getPyramid(gl);
	var offsetSource = getOffset(gl, NCopy);
  // Make the Pyramid and Offset buffers
	var pyramid = bindBuffer(gl, glKeys.pyramid, pyramidSource, ND);
	var offset = bindBuffer(gl, glKeys.offset, offsetSource, ND);
  // Actually draw
	draw(gl, offset, pyramid);
}

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');
  // Get the rendering context for WebGL
  var gl = canvas.getContext('webgl');
  // Compile and bind the shaders
  var program = makeProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE)
  if (program) {
		gl.useProgram(program);
		// Prepare to draw
		var glKeys = {
			'pyramid': gl.getAttribLocation(program, 'a_pyramid'),
			'offset': gl.getAttribLocation(program, 'a_offset'),
		}
		setup(gl, glKeys);
  }
}
