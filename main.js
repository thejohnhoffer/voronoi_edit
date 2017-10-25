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

function parseKeypoints(split_map, ND) {
  var keypoints = [];
  var segments = [];
  // Read new labels per segment
  split_map.forEach( (labels, seg) => {
    // Read keypoints per label
    labels.forEach( (points, label) => {
      // Ensure keypoints all have same dimensions
      var n_points = Math.floor(points.length / ND);
      var ND_points = points.slice(0, n_points * ND);
      keypoints.push(...ND_points);
      // Add segment label for each keypoint
      for (var i = 0; i < n_points; i++) {
        segments.push(parseInt(seg, 10), label);
      }
    });
  });
  return [keypoints, segments];
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
	var size = bufferSource.values.length;
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
  // Clear color and depth buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Apply each offset to a pyramid instance
	ext.vertexAttribDivisorANGLE(offset.key, 1);
	ext.drawArraysInstancedANGLE(gl.TRIANGLE_FAN, 0, pyramid.count, offset.count);
}

function setup(gl, glKeys) {
  // dimensions
  const ND = 3;
  // Specify split points
  var splits = [
		['45', [
			[
				0.0,  0.0,  0.0,
				0.4,  0.0,  0.0,
				0.8,  0.0,  0.0,
			],
			[
				0.0,  0.0,  0.0,
				0.6,  0.2,  0.0,
				1.0,  0.2,  0.0,
			],
		]],
  ];
  // <string, number[][]>
  var split_map = new Map(splits); 
  // Keypoint offset and relabeled IDs
  var [offsets, relabels] = parseKeypoints(split_map, ND);

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Make the Pyramid structure
	var pyramidSource = getPyramid(gl);
  // Keypoint offset parameters
	var offsetSource = {
		values: new Float32Array(offsets),
		usage: gl.DYNAMIC_DRAW,	
	};
  // ID relabel parameters
	var segmentSource = {
		values: new Float32Array(relabels),
		usage: gl.DYNAMIC_DRAW,	
	};
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
