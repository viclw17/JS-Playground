// vertex shader
attribute vec4 a_position;
void main(){
    gl_position = a_position;
}

// fragment shader
precision mediump float;
void main(){
    gl_FragColor = vec4(1, 0, 0.5, 1);
}

////////
// how to use varying
varying vec4 v_color;
attribute vec4 a_position;
void main(){
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1); //2d
    v_color = gl_Position * 0.5 + 0.5;
}

varying vec4 v_color;
void main(){
    gl_FragColor = v_color;
}
