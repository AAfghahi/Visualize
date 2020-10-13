import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const SimplexNoise = require('simplex-noise');
const noise = new SimplexNoise();

const vizInit = function(){
	const file = document.getElementById('thefile');
	const audio = document.getElementById('audio');
	const fileLabel = document.querySelector('label.file');

	document.onload = function(e){
		console.log(e);
		audio.play();
		play();
	}

	file.onchange = function(){
		fileLabel.classList.add('normal');
		audio.classList.add('active');
		const files = this.files;

		audio.src = URL.createObjectURL(files[0]);
		audio.load();
		audio.play();
		play();
	};

	function play(){
		const context = new AudioContext();
		const src = context.createMediaElementSource(audio);
		const analyser = context.createAnalyser();
		src.connect(analyser);
		analyser.connect(context.destination);
		analyser.fftSize = 512;
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		const scene = new THREE.Scene();
		const group = new THREE.Group();
		const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 1000);
		camera.position.set(0,0,100);
		camera.lookAt(scene.position);
		scene.add(camera);

		const renderer = new THREE.WebGLRenderer({alpha: true, antialias:true});
		renderer.setSize(window.innerWidth, window.innerHeight);

		const planeGeometry = new THREE.PlaneGeometry(700, 700, 15, 15);
		const planeMaterial = new THREE.MeshLambertMaterial({
			color: 0x63e0d4,
			side: THREE.DoubleSide,
		
		});

	

		// const plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
		// plane2.rotation.x = -0.5*Math.PI;
		// plane2.position.set(0,-30, 0);
		// group.add(plane2);

		const floatingCube = new THREE.IcosahedronGeometry(20,5);
		const lamMaterial = new THREE.MeshLambertMaterial({
			color:0xffffff,
			wireframe: true,
			skinning:true
		});

		const ball = new THREE.Mesh(floatingCube, lamMaterial);
		ball.position.set(0,0,0);
		group.add(ball);

		const innerCube = new THREE.IcosahedronGeometry(8,3);
		const lamberMaterial = new THREE.MeshLambertMaterial({
			color:0xFCF4A3
		});

		const ball2 = new THREE.Mesh(innerCube, lamberMaterial);
		ball2.position.set(0,0,0);
		group.add(ball2);

		const ambientLight = new THREE.AmbientLight(0x63e0d4);
		scene.add(ambientLight);

		const spotLight = new THREE.SpotLight(0xffffff);
		spotLight.intensity = 0.55;
		spotLight.position.set(-10, 30,20);
		spotLight.lookAt(ball);
		spotLight.castShadow = true;
		scene.add(spotLight);

		const spotLight2 = new THREE.SpotLight(0x8c1c03);
		spotLight2.intensity = 0.9;
		spotLight2.position.set(10, -10, 30);
		spotLight2.lookAt(ball2);
		spotLight2.castShadow = true;
		scene.add(spotLight2);

		scene.add(group);

		document.getElementById('out').appendChild(renderer.domElement);

		window.addEventListener('resize', onWindowResize, false);

		render();

		function render(){
			analyser.getByteFrequencyData(dataArray);

			const lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
			const upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);

			const overallAvg = avg(dataArray);
			const lowerMax = max(lowerHalfArray);
			const lowerAvg = avg(lowerHalfArray);
			const upperMax = max(upperHalfArray);
			const upperAvg = avg(upperHalfArray);

			const lowerMaxFr = lowerMax / lowerHalfArray.length;
			const lowerAvgFr = lowerAvg / lowerHalfArray.length;
			const upperMaxFr = upperMax / upperHalfArray.length;
			const upperAvgFr = upperAvg / upperHalfArray.length;

			// makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));
			
			makeRoughBall(ball, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));
			makeRoughBall(ball2, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));

			group.rotation.y += 0.005;
			renderer.render(scene, camera);
			requestAnimationFrame(render);
		}

		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}
	
		function makeRoughBall(mesh, bassFr, treFr) {
			mesh.geometry.vertices.forEach(function (vertex, i) {
				var offset = mesh.geometry.parameters.radius;
				var amp = 10;
				var time = window.performance.now();
				vertex.normalize();
				var rf = 0.0001;
				var distance = (offset + bassFr ) + noise.noise3D(vertex.x + time *rf*7, vertex.x +  time*rf*8, vertex.z + time*rf*9) * amp * treFr;
				vertex.multiplyScalar(distance);
			});
			mesh.geometry.verticesNeedUpdate = true;
			mesh.geometry.normalsNeedUpdate = true;
			mesh.geometry.computeVertexNormals();
			mesh.geometry.computeFaceNormals();
		}
	
		function makeRoughGround(mesh, distortionFr) {
			mesh.geometry.vertices.forEach(function (vertex, i) {
				var amp = 2;
				var time = Date.now();
				var distance = (noise.noise2D(vertex.x + time * 0.003, vertex.y + time * 0.0001) + 0) * distortionFr * amp;
				vertex.z = distance;
			});
			mesh.geometry.verticesNeedUpdate = true;
			mesh.geometry.normalsNeedUpdate = true;
			mesh.geometry.computeVertexNormals();
			mesh.geometry.computeFaceNormals();
		}
	
		audio.play();
	}
};

window.onload = vizInit();

document.body.addEventListener('touchend', function(ev) { context.resume(); });



function fractionate(val, minVal, maxVal) {
    return (val - minVal)/(maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + (fr * delta);
}

function avg(arr){
    var total = arr.reduce(function(sum, b) { return sum + b; });
    return (total / arr.length);
}

function max(arr){
    return arr.reduce(function(a, b){ return Math.max(a, b); })
}
