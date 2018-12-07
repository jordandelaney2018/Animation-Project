var scene, camera, renderer, mesh, clock;
var meshFloor;

var keyboard = {};
var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
var USE_WIREFRAME = false;

var barrel;

var gun = new THREE.Geometry();
var gunMesh;

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);
    clock = new THREE.Clock();


    function createGun() {
        // Building the gun model
        var material = new THREE.MeshPhongMaterial({color: 0xDBD7CF, wireframe: true});

        var barrelGeometry = new THREE.BoxGeometry(0.15, 0.15, 1);
        barrel = new THREE.Mesh(barrelGeometry, material);
        barrel.position.y = 1.5;

        var sightGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.3);
        var sight = new THREE.Mesh(sightGeometry, material);
        sight.position.y = 1.63;
        sight.position.z = -0.2;

        var smSightGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
        var smallSight = new THREE.Mesh(smSightGeometry, material);
        smallSight.position.y = 1.6;
        smallSight.position.z = 0.48;

        var faceGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        var sightMaterial = new THREE.MeshPhongMaterial({color: 0xFFB306, wireframe: true});
        var sightFace = new THREE.Mesh(faceGeometry, sightMaterial);
        sightFace.position.y = 1.63;
        sightFace.position.z = -0.33;



          //smallSight.parent = barrel;
         //sight.parent = barrel;

        //sightFace.parent = sight;


        //scene.add(sightFace);
        //scene.add(smallSight);
        //scene.add(barrel);
        //scene.add(sight);

        //Merges the shapes into the gun model
          barrel.updateMatrix(); // as needed
          gun.merge(barrel.geometry, barrel.matrix);

          sight.updateMatrix(); // as needed
          gun.merge(sight.geometry, sight.matrix);

          smallSight.updateMatrix(); // as needed
          gun.merge(smallSight.geometry, smallSight.matrix);

         sightFace.updateMatrix(); // as needed
         gun.merge(sightFace.geometry, sightFace.matrix);

         // Adds gun model to the scene
         gunMesh= new THREE.Mesh(gun, material);
         scene.add(gunMesh);



    }
    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(10,10, 10,10),
        new THREE.MeshPhongMaterial({color:0xB3AEAC, wireframe:USE_WIREFRAME})
    );
    meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
    scene.add(meshFloor);

    camera.position.set(0, player.height, -5);
    camera.lookAt(new THREE.Vector3(0,player.height,0));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1280, 720);
    document.body.appendChild(renderer.domElement);

    var light = new THREE.AmbientLight( 0x999999); // soft white light
    scene.add( light );

    createGun();
    animate();

}

function animate(){
    requestAnimationFrame(animate);
    var time = Date.now() * 0.0005;
    var delta = clock.getDelta();

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
// position the gun in front of the camera
    gunMesh.position.set(
        camera.position.x - Math.sin(camera.rotation.y + Math.PI/6) * 0.75,
        camera.position.y - 2 + Math.sin(time*4 + camera.position.x + camera.position.z)*0.01,
        camera.position.z + Math.cos(camera.rotation.y + Math.PI/6) * 0.75
   );
    gunMesh.rotation.set(
        camera.rotation.x,
        camera.rotation.y - Math.PI,
        camera.rotation.z
    );
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
