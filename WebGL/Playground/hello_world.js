"use strict";

function resize(canvas) {
    // Lookup the size the browser is displaying the canvas.
    var displayWidth  = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    if (canvas.width  != displayWidth ||
        canvas.height != displayHeight) {

      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
}

// function to create shader, upload the GLSL source, and compile the shader
function createShader(gl, type, source){
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success){
        return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}
// function to link 2 shaders into a GLSL program
function createProgram(gl, vertexShader, fragmentShader){
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success){
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}
// main
function main(){
    // initialization code
    ///////////////////////
    console.log("whats going on?");
    var canvas = document.getElementById("c");
    // const canvas = document.querySelector("#c");
    var gl = canvas.getContext("webgl");
    if(!gl){
        // no webgl for you!
    }else{
        console.log("i have webgl!!!");
    }

    // call function
    // Get the strings for our GLSL shaders
    var vertexShaderSource = document.getElementById("2d-vertex-shader").text;
    var fragmentShaderSource = document.getElementById("2d-fragment-shader").text;
    // create GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // call function
    // Link the two shaders into a program
    var program = createProgram(gl, vertexShader, fragmentShader);

    // supply data(input) to GLSL program
    // look up the location of the attribute(a_position) for the program
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    // attributes get data from buffer, create buffer
    var positionBuffer = gl.createBuffer();
    // "global bind point" AKA internal global variable inside WebGL
    // bind gl.ARRAY_BUFFER to variable positionBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // put data into buffer
    var positions = [ // a javascript array
      0.0, 0.0,
      0.0, 0.5,
      0.7, 0.0,
    ];
    // convert javascript array into strong-type-data array,
    // then copy array data to positionBuffer on GPU
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // code above this line is initialization code.
    // code below this line is rendering code.

    // Rendering
    ////////////
    resize(gl.canvas);
    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    // map -1 +1 clipspace to 0 gl.canvas.width etc.
    gl.viewport(0,0,gl.canvas.width, gl.canvas.height);
    // clear
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // use created program
    gl.useProgram(program)
    // enable attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // tell attribute how to get data out of positionBuffer
    var size = 2;           // 2 components per iteration
    var type = gl.FLOAT;    // data is 32bit floats
    var normalize = false;
    var stride = 0;         // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;         // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation,size,type,normalize,stride,offset);

    // draw!
    // execute GLSL program
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);
}

main();

/*
Converting from clip space to screen space if the canvas size happened to be 400x300:
clip space      screen space
   0, 0       ->   200, 150
   0, 0.5     ->   200, 225
 0.7, 0       ->   340, 150
WebGL will now render that triangle. For every pixel it is about to draw WebGL will call our fragment shader. Our fragment shader just sets gl_FragColor to 1, 0, 0.5, 1. Since the Canvas is an 8bit per channel canvas that means WebGL is going to write the values [255, 0, 127, 255] into the canvas.
*/
