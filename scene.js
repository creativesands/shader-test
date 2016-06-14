/**
 * Created by sandeepkumar on 04/03/16.
 */

var rand = (min, max) => lerp(Math.random(), min, max);
var lerp = (ratio, start, end) => start + (end - start) * ratio;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 10, window.innerWidth/window.innerHeight, 1, 100000 );

var container = document.querySelector('.container');

var renderer = new THREE.WebGLRenderer({ antialiase: true });
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

fpsStats = new Stats();
fpsStats.setMode( 0 );
fpsStats.domElement.style.position = 'absolute';
fpsStats.domElement.style.top = '0px';
fpsStats.domElement.style.left = '0px';
container.appendChild( fpsStats.domElement );

cpuStats = new Stats();
cpuStats.setMode( 1 );
cpuStats.domElement.style.position = 'absolute';
cpuStats.domElement.style.top = '0px';
cpuStats.domElement.style.left = '100px';
container.appendChild( cpuStats.domElement );

memStats = new Stats();
memStats.setMode( 2 );
memStats.domElement.style.position = 'absolute';
memStats.domElement.style.top = '0px';
memStats.domElement.style.left = '200px';
container.appendChild( memStats.domElement );

var light = new THREE.AmbientLight( 0xffffff );
scene.add( light );

var dLight = new THREE.DirectionalLight( 0xff0000, 1 );
dLight.position.set( 1, 1, 0 );
scene.add( dLight );

var cubes = [];
for( var i = 0; i < 2000; i ++ ) {
	var geometry = new THREE.BoxGeometry( 2, 2, 2 );
	// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var material = new THREE.MeshLambertMaterial( {
	    opacity: 1,
	    color: 0x00ff00,
	    shading: THREE.SmoothShading,
	    shininess: 0.5
	} );
	var cube = new THREE.Mesh( geometry, material );
	cube.position.x = rand(-150, 150);
	cube.position.y = rand(-80, 80);
	cube.position.z = rand(-100, 250);
	cubes.push( cube );
	scene.add( cube );	
}

camera.position.z = 300;

var render = function () {
    requestAnimationFrame( render );

	fpsStats.update();
	memStats.update();
	cpuStats.update();

    cubes.forEach( cube => {
    	cube.rotation.x += rand(0, 0.2);
    	cube.rotation.y += rand(0, 0.2);
    });

    renderer.render(scene, camera);
};

render();


// // set the scene size
// var WIDTH = window.innerWidth,
//     HEIGHT = window.innerHeight;

// // set some camera attributes
// var VIEW_ANGLE = 45,
//     ASPECT = WIDTH / HEIGHT,
//     NEAR = 0.1,
//     FAR = 10000;

// // create a WebGL renderer, camera
// // and a scene
// var renderer = new THREE.WebGLRenderer();
// var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR ); 
// var scene = new THREE.Scene();

// // the camera starts at 0,0,0 so pull it back
// camera.position.z = 300;

// // start the renderer - set the clear colour
// // to a full black
// renderer.setClearColor(new THREE.Color(0, 1));
// renderer.setSize(WIDTH, HEIGHT);

// // attach the render-supplied DOM element
// var container = document.querySelector('.container');
// container.appendChild( renderer.domElement );

// // create the particle variables
// var particleCount = 1800,
//     particles = new THREE.Geometry(),
// 	pMaterial;

// var loader = new THREE.TextureLoader();

// loader.load(
// 	'images/1-1.png',
// 	function ( texture ) {
// 		pMaterial = new THREE.PointsMaterial({
// 			color: 0xFFFFFF,
// 			size: 20,
// 			map: texture,
// 			blending: THREE.AdditiveBlending,
// 			transparent: true
// 		});
// 	}
// );

// // now create the individual particles
// for(var p = 0; p < particleCount; p++) {

// 	// create a particle with random
// 	// position values, -250 -> 250
// 	var pX = Math.random() * 500 - 250,
// 		pY = Math.random() * 500 - 250,
// 		pZ = Math.random() * 500 - 250,
// 	    particle = new THREE.Vector3(pX, pY, pZ);

// 	// create a velocity vector
// 	particle.velocity = new THREE.Vector3(
// 		0,				// x
// 		-Math.random(),	// y
// 		0);				// z

// 	// add it to the geometry
// 	particles.vertices.push(particle);
// }

// // create the particle system
// var particleSystem = new THREE.Points(
// 	particles,
// 	pMaterial);

// particleSystem.sortParticles = true;

// // add it to the scene
// scene.add(particleSystem);

// // animation loop
// function update() {
	
// 	// add some rotation to the system
// 	particleSystem.rotation.y += 0.01;
	
// 	var pCount = particleCount;
// 	while(pCount--) {
// 		// get the particle
// 		var particle = particles.vertices[pCount];
		
// 		// check if we need to reset
// 		if(particle.y < -200) {
// 			particle.y = 200;
// 			particle.velocity.y = 0;
// 		}
		
// 		// update the velocity
// 		particle.velocity.y -= Math.random() * .1;
		
// 		// and the position
// 		particle.position.addSelf(particle.velocity);
// 	}
	
// 	// flag to the particle system that we've
// 	// changed its vertices. This is the
// 	// dirty little secret.
// 	particleSystem.geometry.__dirtyVertices = true;
	
// 	renderer.render(scene, camera);
	
// 	// set up the next call
// 	requestAnimationFrame(update);
// }

// requestAnimationFrame(update);