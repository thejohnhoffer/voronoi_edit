function makeShader(gl, source, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function makeProgram(gl, vertexShaderSource, fragmentShaderSource) {
  var program = gl.createProgram();
  var vshader = makeShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  var fshader = makeShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
  gl.attachShader(program, vshader);
  gl.deleteShader(vshader);
  gl.attachShader(program, fshader);
  gl.deleteShader(fshader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log("Could not initialise shaders");

      console.log(gl.getShaderInfoLog(fshader));
      console.log(gl.getShaderInfoLog(vshader));
      console.log(gl.getProgramInfoLog(program));

      return undefined;

  }
  return program;
};
