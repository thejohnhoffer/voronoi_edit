// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
const VSHADER_SOURCE = `
void main() {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 10.0;
}
`;

// Fragment shader program
const FSHADER_SOURCE = `
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

function draw(gl) {
  // Set canvas to clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a point
  gl.drawArrays(gl.POINTS, 0, 1);
}

function setup(gl) {
  // Specify the clear color
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Actually draw
	draw(gl);
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
		setup(gl);
  }
}
