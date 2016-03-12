// Victor test
//We are loading the Three.js library from the cdn here: http://cdnjs.com/libraries/three.js/
//No need for a local copy of the library
var scene;
var camera;
var renderer;

function scene_setup() {
    //This is all code needed to set up a basic ThreeJS scene

    //1. initialize the scene
    scene = new THREE.Scene();
    //2. initialize the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    //3. initialize the WebGL renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    //add it to the document
    document.body.appendChild(renderer.domElement);
}

//Initialize the Threejs scene
scene_setup();

//Pull the shader code from the html
var shaderCode = document.getElementById("fragShader").innerHTML;



//Our textures are up on github
//var textureURL = "https://raw.githubusercontent.com/tutsplus/Beginners-Guide-to-Shaders/master/Part3/images/blocks.JPG"
//var normalURL = "https://raw.githubusercontent.com/tutsplus/Beginners-Guide-to-Shaders/master/Part3/normal_maps/blocks_normal.JPG"

//THREE.ImageUtils.crossOrigin = '';//Allows us to load an external image

//Load in the texture and the normal
//var texture = THREE.ImageUtils.loadTexture(textureURL);
//var normal = THREE.ImageUtils.loadTexture(normalURL);




//Set up the uniforms we'll send to our share
//More info on uniform types: http://threejs.org/docs/#Reference/Materials/ShaderMaterial
var uniforms = {
    tex: {
        type: 't',
        value: texture
    }, //The texture
    norm: {
        type: 't',
        value: normal
    }, //Normal
    res: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    }, //Keeps the resolution
    light: {
        type: 'v4',
        value: new THREE.Vector4()
    } //Our light source, we will use the 3 numbers as have x,y and height away from the screen. 4th value is whether the light is on or not
}

//We stick our shader onto a 2d plane big enough to fill the screen
var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: shaderCode
})
var geometry = new THREE.PlaneGeometry(10, 10);
var sprite = new THREE.Mesh(geometry, material);

//Add it to the scene
scene.add(sprite);

//Move the camera back so we can see it
camera.position.z = 2;

// light
uniforms.light.value.z = 0.3; //How high up our light source should be
uniforms.light.value.w = 1.0; //Turn light on

//Render everything!
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();

document.onmousemove = function(event) {
    //Update the light source to follow our mouse
    uniforms.light.value.x = event.clientX;
    uniforms.light.value.y = event.clientY;
}

document.onmousedown = function(event) {
    //Toggle lighting system
    if (uniforms.light.value.w)
        uniforms.light.value.w = 0.0;
    else uniforms.light.value.w = 1.0;
}
