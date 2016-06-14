var vertexShader = `
	varying vec2 vUv;

	void main() {
	    vUv = uv;
	    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	    gl_Position = projectionMatrix * mvPosition;
	}
`;

var fragmentShader = `
	uniform float time;
	uniform vec2 resolution;
	uniform sampler2D texture;
	varying vec2 vUv;

	void main( void ) {
	    vec4 color = texture2D( texture, vUv ).rgba;
	    gl_FragColor = vec4( color.r, 1.0, 1.0, 1.0 );
	}
`;

var uniforms = {
	time: { type: "f", value: 1.0 },
	resolution: { type: "v2", value: new THREE.Vector2() },
	texture: { type: "t", value: new THREE.TextureLoader().load( "images/original/1-2.png" ) }
};

var container, stats;
var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, size;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth;
var windowHalfY = window.innerHeight;

init();
animate();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.position.z = 1500;
	scene = new THREE.Scene();
	scene.fog = /*new THREE.Fog(0xf7d9aa, 100, 2000);*/ new THREE.FogExp2( 0x000000, 0.0007 );
	geometry = new THREE.Geometry();
	for ( i = 0; i < 50000; i ++ ) {
		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 2000 - 1000;
		vertex.y = Math.random() * 2000 - 1000;
		vertex.z = Math.random() * 2000 - 1000;
		geometry.vertices.push( vertex );
	}
	parameters = [
		[ [1, 1, 0.5], 5 ],
		[ [0.95, 1, 0.5], 4 ],
		[ [0.90, 1, 0.5], 3 ],
		[ [0.85, 1, 0.5], 2 ],
		[ [0.80, 1, 0.5], 1 ]
	];

	var loader = new THREE.TextureLoader();

	// var textures = [
	// 	'images/1-1.png', 
	// 	'images/1-2.png', 
	// 	'images/1-3.png', 
	// 	'images/1-4.png', 
	// 	'images/1-5.png'
	// ].map( loader.load );

	var pointMaterial = new THREE.PointsMaterial({
		color: 0xFFFFFF,
		// size: 20,
		// map: loader.load('images/1-1.png'),
		blending: THREE.AdditiveBlending,
		transparent: true
	});

	console.log( pointMaterial );

	var shaderMaterial = new THREE.ShaderMaterial( {

	    uniforms: uniforms,
	    vertexShader: vertexShader,
	    fragmentShader: fragmentShader,
	    side: THREE.DoubleSide,
	    transparent: true

	} );

	for ( i = 0; i < parameters.length; i ++ ) {
		color = parameters[i][0];
		pointMaterial.size  = parameters[i][1] * 10;
		// pointMaterial.map = textures[ Math.round(Math.random() * 10) % 5 ];
		materials[i] = new THREE.PointsMaterial( pointMaterial );
		// particles = new THREE.Points( geometry, pointMaterial );
		particles = new THREE.Points( geometry, shaderMaterial );
		particles.lookAt( new THREE.Vector3( 100, 200, 500 ) )
		particles.rotation.x = Math.random() * 6;
		particles.rotation.y = Math.random() * 6;
		particles.rotation.z = Math.random() * 6;
		scene.add( particles );
	}

	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x000000 );
	container.appendChild( renderer.domElement );
	stats = new Stats();
	container.appendChild( stats.dom );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {
	if ( event.touches.length === 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function onDocumentTouchMove( event ) {
	if ( event.touches.length === 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function animate() {
	requestAnimationFrame( animate );
	render();
	stats.update();
}

function render() {
	var time = Date.now() * 0.00005;
	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
	camera.lookAt( scene.position );
	for ( i = 0; i < scene.children.length; i ++ ) {
		var object = scene.children[ i ];
		if ( object instanceof THREE.Points ) {
			object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
		}
	}
	// for ( i = 0; i < materials.length; i ++ ) {
	// 	color = parameters[i][0];
	// 	h = ( 360 * ( color[0] + time ) % 360 ) / 360;
	// 	materials[i].color.setHSL( h, color[1], color[2] );
	// }
	renderer.render( scene, camera );
}