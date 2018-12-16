// Global variables
var scene, camera, renderer, clock, barrel, gunMesh, meshFloor;

// Setup variables
var keyboard = {};
var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
var wireframeOnOff = false;
var iFrame = 0;
var target = [];

// Animate target function needs to be global

function spawnTarget(){
    var targetY ;
    var targetZ ;
    var targetX ;
    var geometry = new THREE.CylinderGeometry( 1, 1, 1, 10 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );

    for (var i = 0; i <= 5; i++) {
        // Randomly place targets
        var j = Math.floor((Math.random() * 3) + 1);
        var k = Math.floor((Math.random() * 10) + 1);
        var l = Math.floor((Math.random() * 10) + 1);

        targetY =  j;
        targetZ =  k;
        targetX =  l;

        target[i] = new THREE.Mesh( geometry, material );
        target[i].rotation.x -= Math.PI / 2;
        target[i].position.y = targetY;
        target[i].position.z = targetZ;
        target[i].position.x = targetX;
        scene.add( target[i] );

        //Re set targets original value before randomising again
        targetY = 0;
        targetZ = 0;
        targetX = 0;

    }

   // target[i].position.x = Math.sin(iFrame/100)*5;
   // target[i].position.z = Math.cos(iFrame/100)*5;


}
// Init function------------------------------------------------------------------------------
function init(){
    var material = new THREE.MeshPhongMaterial({color: 0x494747, wireframe: false});

    //Scene camera and clock deceleration
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, 1920/1080, 0.1, 1000);
    clock = new THREE.Clock();



 // Create Barrel Function -----------------------------------------------------------
    // Creates the individual parts of the barrel the merges and adds texture
        // Can be placed around the environment using the variables in the function
 function createExoBarrel(xPos, zPos, yPos){
    // Material for barrel parts
    var barrelMat = new THREE.MeshPhongMaterial({color: 0xB92020, wireframe: false});

    // Main section
    var geometry = new THREE.CylinderGeometry( 0.5, 0.5, 1, 15 );
    var expBarrel = new THREE.Mesh( geometry, barrelMat );
    expBarrel.position.y = 1.5;

    // Ring Sections
    var ringGeom = new THREE.CylinderGeometry( 0.55, 0.55, 0.1, 15 );

    var ring = new THREE.Mesh( ringGeom, barrelMat );
    var ring2 = new THREE.Mesh( ringGeom, barrelMat );
    var ring3 = new THREE.Mesh( ringGeom, barrelMat );
    ring.position.y = 1.5;
    ring2.position.y = 2;
    ring3.position.y = 1;

   // scene.add( ring,ring2,ring3 );
   // scene.add( expBarrel );

     // Merge geoms together and apply texture
        // Places the barrel onto the map
    var loader = new THREE.TextureLoader();
     loader.load(
          //resource URL
         'Media/barrel.jpg',
         function ( texture ) {
             var gunMaterial = new THREE.MeshPhongMaterial({map: texture});
             console.log("Texture loaded")
             var barrel = new THREE.Geometry();
             expBarrel.updateMatrix(); // as needed
             barrel.merge(expBarrel.geometry, expBarrel.matrix);

             ring.updateMatrix(); // as needed
             barrel.merge(ring.geometry, ring.matrix);

             ring2.updateMatrix(); // as needed
             barrel.merge(ring2.geometry, ring2.matrix);

             ring3.updateMatrix(); // as needed
             barrel.merge(ring3.geometry, ring3.matrix);

             // Adds gun model to the scene
             barrelMesh= new THREE.Mesh(barrel, gunMaterial);
             scene.add(barrelMesh);
             barrelMesh.position.z =zPos;
             barrelMesh.position.x =xPos;
             barrelMesh.position.y =yPos;
      });
}
//------------------------------------------------------------------------------------


// Create Room Function --------------------------------------------------------------
    // Creates a floor and 4 walls around it
function createRoom(){
    // Floor Mesh
    var floorLoader = new THREE.TextureLoader();
    floorLoader.load(
        // resource URL
        'Media/floor.jpg',
        function ( floorTexture ) {
            var floorMat = new THREE.MeshPhongMaterial({map: floorTexture});
            var floorGeom =  new THREE.PlaneGeometry(50, 50, 50, 50, 20,20,20),
                meshFloor = new THREE.Mesh(floorGeom, floorMat);

            meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
            scene.add(meshFloor);
        });
    // Wall Meshes
    var wallLoader = new THREE.TextureLoader();
    wallLoader.load(
        // resource URL
        'Media/wall.jpg',
        function ( wallTexture ) {
            var wallMat = new THREE.MeshPhongMaterial({map: wallTexture});
            var wallGeom =  new THREE.BoxGeometry(50, 10, 1,),
                wallMesh1 = new THREE.Mesh(wallGeom, wallMat),
                wallMesh2 = new THREE.Mesh(wallGeom, wallMat),
                wallMesh3 = new THREE.Mesh(wallGeom, wallMat),
                wallMesh4 = new THREE.Mesh(wallGeom, wallMat);
            wallMesh1.position.y = 5;
            wallMesh2.position.y = 5;
            wallMesh3.position.y = 5;
            wallMesh4.position.y = 5;
            // Positioning for walls
            wallMesh1.position.z = 25;
            wallMesh2.position.z = -25;

            wallMesh3.rotation.y -= Math.PI / 2;
            wallMesh4.rotation.y -= Math.PI / 2;

            wallMesh3.position.x = 25;
            wallMesh4.position.x = -25;
            scene.add(wallMesh1,wallMesh2,wallMesh3,wallMesh4);
        });

}
 // --------------------------------------------------------------------------------

// Flickering light function--------------------------------------------------------
function flickerLight(){
    var light = new THREE.PointLight( 0xff0000, 1, 200 );
    light.position.set( 50, 50, 50 );
    scene.add( light );
}
//----------------------------------------------------------------------------------

// Function to place boxes in environment -------------------------------------------
function placeBox(boxYPos, boxZPos, boxXPos){

    var boxLoader = new THREE.TextureLoader();
    boxLoader.load(
        // resource URL
        'Media/box.jpg',
        function ( boxTexture ) {
            var boxMat = new THREE.MeshPhongMaterial({map: boxTexture});
            var geometry = new THREE.BoxGeometry(1, 1, 1);

            var cube = new THREE.Mesh(geometry, boxMat);
            scene.add(cube);
            cube.position.z =boxZPos;
            cube.position.x =boxXPos;
            cube.position.y =boxYPos;

        });
}
// ----------------------------------------------------------------------------------

// Spawn Target Function ------------------------------------------------------------

    function spawnTarget(){

        var geometry = new THREE.CylinderGeometry( 1, 1, 1, 10 );
        var targetLoader = new THREE.TextureLoader();
        targetLoader.load(
            // resource URL
            'Media/target.png',
            function ( targetTexture ) {
                var targetMat = new THREE.MeshBasicMaterial( {map: targetTexture} );
                for (var i = 0; i <= 5; i++) {
                    target[i] = new THREE.Mesh(geometry, targetMat);
                    target[i].rotation.x -= Math.PI / 2;
                    scene.add(target[i]);
        }

        target[0].position.y =  10;
        target[0].position.z = -20;
        target[0].position.x = 5;

        target[1].position.y =  4;
        target[1].position.z = -18;
        target[1].position.x = 15;

        target[2].position.y =  3;
        target[2].position.z = -10;
        target[2].position.x = -18;

        target[3].position.y =  4;
        target[3].position.z = -15;
        target[3].position.x = -5;

        target[4].position.y = 2;
        target[4].position.z = -5;
        target[4].position.x = 4;

        target[5].position.y =  15;
        target[5].position.z = -20;
        target[5].position.x = -3;
    });

    }


// ---------------------------------------------------------------------------------
// Bullet for Gun Model ------------------------------------------------------------
    var geometry = new THREE.CylinderGeometry( 0.05, 0.05, 0.5, 32 );
    var bulletMat = new THREE.MeshPhongMaterial({color: 0x00FFFF, wireframe: false});
    var cylinder = new THREE.Mesh( geometry, bulletMat );
    scene.add( cylinder );

//----------------------------------------------------------------------------------
    // Camera Set
    camera.position.set(0, player.height, -5);
    camera.lookAt(new THREE.Vector3(0,player.height,0));

    // Renderer Set
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1280, 720);
    document.body.appendChild(renderer.domElement);

    // Ambient Light
    var light = new THREE.AmbientLight( 0x716B6B); // soft white light
    scene.add( light );

    // Run Functions
    // there three together makes a stack of barrels
    createExoBarrel(4,23,-1);
    createExoBarrel(5,23,-1);
    createExoBarrel(4.5,23,0.1);

    createExoBarrel(15,12,-1);
    createExoBarrel(6,9,-1);
    createExoBarrel(23,1,-1);

    placeBox(0.5,10,10);
    placeBox(0.5,15,10);
    placeBox(0.5,10,15);

    createRoom();

    flickerLight();

    spawnTarget();

    animate();

}
// End of innit function ------------------------------------------------------------------

// Functions to create the random spark effects-----------------------------------------------
// Variables declared here
var particleSet = [],
    particleCount = 400,
    spreadMin = 0.01,
    spreadMax = 0.08,
    speed =5, // higher means slower
    timeToSlow = 0.8;

// Creating the particles
function parts() {
    var geometry = new THREE.PlaneGeometry( 0.01, 0.01 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffff00, transparent: true } );
    var particle = new THREE.Mesh( geometry, material );

    return particle;
}

// Makes the particles and adds them to scene
function makeParts() {
    var particles = parts()

    particles.position.x += 5;
    particles.position.y += 0;
    //particles.velocity = new THREE.Vector3( 0.01, 0.01, 0 );
    scene.add( particles );
    particleSet.push( particles );
}

function rRange(min, max) {
    return Math.random() * (max - min) + min;
}

function placeSparks(x,y){
    if ( particleSet.length <= particleCount ) {
        makeParts();
    }

    for ( var i = 0; i < particleSet.length; i++ ) {
        var pArray = particleSet.indexOf( i );

        particleSet[i].material.opacity -= 0.008;

        if ( particleSet[i].material.opacity <= 0 ) {

            particleSet[i].position.x = x;
            particleSet[i].position.y = y;
            particleSet[i].material.opacity = 1

        }

        particleSet[i].position.x += (0.002 + rRange( -spreadMin, spreadMax) / speed) * timeToSlow;
        particleSet[i].position.y += (0.002 + rRange( -spreadMin, spreadMax) / speed) * timeToSlow;

    }
}
// End of particle functions ------------------------------------------------------------

// Animate function----------------------------------------------------------------------
function animate(){
    requestAnimationFrame(animate);
    function moveTargets(){
        target[0].position.y = Math.sin(iFrame/100)*10;

        target[1].position.x = Math.sin(iFrame/100)*5;

        target[2].position.x = Math.sin(iFrame/100)*10;

        target[3].position.y = Math.sin(iFrame/100)*8;

        target[4].position.x = Math.sin(iFrame/100)*5;

        target[5].position.y = Math.sin(iFrame/100)*6;
    }
    moveTargets();
    iFrame ++;



    placeSparks(5,0);
    placeSparks(15,0);
    placeSparks(-12,0);



    // Keyboard Inputs for player movement
    if(keyboard[87]){ // W key
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }
    if(keyboard[83]){ // S key
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
    if(keyboard[65]){ // A key
        // Redirect motion by 90 degrees
        camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
    }
    if(keyboard[68]){ // D key
        camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
    }

    // Keyboard turn inputs
    if(keyboard[37]){ // left arrow key
        camera.rotation.y -= player.turnSpeed;
    }
    if(keyboard[39]){ // right arrow key
        camera.rotation.y += player.turnSpeed;
    }
    renderer.render(scene, camera);
}

function keyDown(event){
    keyboard[event.keyCode] = true;
}

function keyUp(event){
    keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;

