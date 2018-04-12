attribute vec4 a_position;
void main(){
    gl_position = a_position;
}

precision mediump float;
void main(){
    gl_FragColor = vec4(1, 0, 0.5, 1);
}
