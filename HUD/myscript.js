var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); // Perspective projection parameters
camera.position.x = 0;
camera.position.y = 5;
camera.position.z = 20;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // Size of the 2D projection
document.body.appendChild(renderer.domElement); // Connecting to the canvas

// Barrel
var geometry = new THREE.CylinderGeometry( 1.5, 1.5, 6, 15 );
var material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
var cylinder = new THREE.Mesh( geometry, material );
// Warning sign

// Add objects to scene
scene.add( cylinder );

// controls
controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.minDistance = 100;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2;


// ambient light
var lightAmbient = new THREE.AmbientLight( 0x222222 ); // soft white light, ambient, so that you get a slight bit of light all over, however will add in more light later. good to have very subtle amibent light in background so that unlit parts of scene still get some sligth shading
scene.add(lightAmbient);

// add spotlight
var pointLight = new THREE.SpotLight(0xffffff); // pointlight comes from one direction and points onto a certian part of the scene
pointLight.position.set(3, 5, 5);
pointLight.intensity = 0.8;
pointLight.penumbra = 0.5; // larger nuber gives a nicer smoothign effect to the edges
pointLight.angle = Math.PI/8; // the larger the number the smaller the size of the cirlce of light cast
scene.add(pointLight);


// Floor
var geoFloor = new THREE.PlaneGeometry(10, 10, 16);
var matFloor = new THREE.MeshPhongMaterial( {color: 0xFFFFFF, side: THREE.DoubleSide });
var meshFloor = new THREE.Mesh(geoFloor, matFloor);

scene.add(meshFloor);

meshFloor.rotation.x = -Math.PI/2;

var iFrame = 0;



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate()
{
    requestAnimationFrame(animate);


    iFrame++;

    renderer.render(scene, camera);

    requestAnimationFrame( animate );
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();

}
animate();