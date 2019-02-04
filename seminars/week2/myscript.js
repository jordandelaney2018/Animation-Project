// Scene
var scene = new THREE.Scene();

// Camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -1;
camera.position.z = 4;
camera.position.y = 2;

// Render
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

// Ambient light
var lightAmbient = new THREE.AmbientLight( 0x888888 ); 
scene.add(lightAmbient);

// Point light
var lightThis = new THREE.PointLight(0xffffff);
lightThis.position.set(3, 10, 3);
lightThis.intensity = 0.8;
scene.add(lightThis);



// Ball 1
var gBall1= new THREE.SphereGeometry(0.5, 18, 18);
var mBall1 = new THREE.MeshPhongMaterial( { color: 0x669900 } );
var meshBall1 = new THREE.Mesh(gBall1, mBall1);
meshBall1.position.y = 3.5;
scene.add(meshBall1);

// Ball 2
var gBall2= new THREE.SphereGeometry(0.3, 18, 18);
var mBall2 = new THREE.MeshPhongMaterial( { color: 0x66FF00 } );
var meshBall2 = new THREE.Mesh(gBall2, mBall2);
meshBall2.position.y = 2.2;
scene.add(meshBall2);

// Floor
var gFloor = new THREE.PlaneGeometry(3, 3);
var mFloor = new THREE.MeshPhongMaterial( {color: 0x33FF33, side: THREE.DoubleSide} );
var floor = new THREE.Mesh(gFloor, mFloor);
floor.rotation.x = 90;
floor.position.x = floor.position.y = floor.position.z = 0;
scene.add(floor);


// Add mouse/camera controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();


// The animate function: called every frame
var iFrame = 0;
function animate()
{
	requestAnimationFrame(animate);

    // Move ball bits by bits
    meshBall1.position.y -= 0.007;

    var distance = Math.sqrt(
    (meshBall1.position.x -  meshBall2.position.x) * (meshBall1.position.x -  meshBall2.position.x) + // Working out square root
    (meshBall1.position.y -  meshBall2.position.y) * (meshBall1.position.y -  meshBall2.position.y) +
    (meshBall1.position.z -  meshBall2.position.z) * (meshBall1.position.z -  meshBall2.position.z)
    );
   
    var sumOfRadious = 0.5 + 0.3; // Radious of both balls added together 
    var collision = distance < sumOfRadious; // true if condidion is met

    // floor collision
    var ballFloorCollision = meshBall1.position.y < 0.05; // Floor is at 0.05( normally would be 0.00 however is on an anagle ), 

    //if (collision) this one tests collison between balls
    if (ballFloorCollision)
    {
        meshBall1.material.color.setHex(0xFF0000);
    }
    else
    {
        meshBall1.material.color.setHex(0x669900);      
    }



    iFrame ++;
   	renderer.render(scene, camera);
}
animate();


////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Kinectron codes starting from here///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initialize kinectron
kinectron = new Kinectron("192.168.60.54"); // Define and create an instance of kinectron
kinectron.makeConnection(); // Create connection between remote and application
kinectron.startTrackedBodies(getBodies); // Start tracked bodies and set callback

// Add a ball for the left hand
var gLH= new THREE.SphereGeometry(0.1, 18, 18);
var mLH = new THREE.MeshPhongMaterial( { color: 0xCCCCCC } ); 
var meshLH = new THREE.Mesh(gLH, mLH);
scene.add(meshLH);

// Add a ball for the right hand
var gRH= new THREE.SphereGeometry(0.1, 18, 18);
var mRH = new THREE.MeshPhongMaterial( { color: 0x00CCCC } ); 
var meshRH = new THREE.Mesh(gRH, mRH);
scene.add(meshRH);

// Draw a line with 4 points
var mLine = new THREE.LineBasicMaterial({color: 0xff9999});
var gLine = new THREE.Geometry();
gLine.vertices.push(new THREE.Vector3(0,0,0));
gLine.vertices.push(new THREE.Vector3(0,1,0));
gLine.vertices.push(new THREE.Vector3(0,1,1));
gLine.vertices.push(new THREE.Vector3(0,2,2));
var meshLine = new THREE.Line(gLine, mLine);
scene.add(meshLine);

// The getBodies callback function: called once every time kinect obtain a frame
function getBodies(skeleton) 
{ 
	meshLH.position.x = skeleton.joints[kinectron.HANDLEFT].cameraX;
	meshLH.position.y = skeleton.joints[kinectron.HANDLEFT].cameraY;
	meshLH.position.z = skeleton.joints[kinectron.HANDLEFT].cameraZ;
	meshRH.position.x = skeleton.joints[kinectron.HANDRIGHT].cameraX;
	meshRH.position.y = skeleton.joints[kinectron.HANDRIGHT].cameraY;
	meshRH.position.z = skeleton.joints[kinectron.HANDRIGHT].cameraZ;


	meshLine.geometry.vertices[3].x = skeleton.joints[kinectron.HANDRIGHT].cameraX;
	meshLine.geometry.vertices[3].y = skeleton.joints[kinectron.HANDRIGHT].cameraY;
	meshLine.geometry.vertices[3].z = skeleton.joints[kinectron.HANDRIGHT].cameraZ;

	meshLine.geometry.vertices[0].x = skeleton.joints[kinectron.HANDLEFT].cameraX;
	meshLine.geometry.vertices[0].y = skeleton.joints[kinectron.HANDLEFT].cameraY;
	meshLine.geometry.vertices[0].z = skeleton.joints[kinectron.HANDLEFT].cameraZ;





	meshLine.geometry.verticesNeedUpdate = true;

}
