import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const SimplexNoise = require('simplex-noise');
const noise = new SimplexNoise();

const init = function(){
	const file = document.getElementById('thefile');
	const audio = document.getElementById('audio');
	const fileLabel = document.querySelector('label.file');
	let changer = true;
	let i = 0;
	
	

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
		const colors = [0xffffff, 0x63e0d4, 0xFF0000, 0x808000, 0xF39C12, 0x0E6251,  0xFFA233, 0xFFD133, 0xE6FF33 ];
		const context = new AudioContext();
		const src = context.createMediaElementSource(audio);
		const analyser = context.createAnalyser();
		src.connect(analyser);
		analyser.connect(context.destination);
		analyser.fftSize = 2048;
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
			wireframe:true
		});

	

		// const plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
		// plane2.rotation.x = -0.5*Math.PI;
		// plane2.position.set(0,-10, 0);
		// group.add(plane2);


		// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		// plane.rotation.x = -0.5*Math.PI;
		// plane.position.set(0,30, 0);
		// group.add(plane);

		const floatingCube = new THREE.IcosahedronGeometry(17,5);
		const lamMaterial = new THREE.MeshLambertMaterial({
			color:0xffffff,
			wireframe: true,
			skinning:true
		});

		const ball = new THREE.Mesh(floatingCube, lamMaterial);
		ball.position.set(0,10,0);
		group.add(ball);

		const innerCube = new THREE.IcosahedronGeometry(9,3);
		const lamberMaterial = new THREE.MeshLambertMaterial({
			color:colors[0]
		});

		const ball2 = new THREE.Mesh(innerCube, lamberMaterial);
		ball2.position.set(0,10,0);
		group.add(ball2);

		const ambientLight = new THREE.AmbientLight(colors[0], 0.5);
		scene.add(ambientLight);



		const spotLight = new THREE.SpotLight(0xffffff);
		spotLight.intensity = 0.55;
		spotLight.position.set(-10, 30,20);
		spotLight.lookAt(ball);
		spotLight.castShadow = true;
		scene.add(spotLight);

		const spotLight2 = new THREE.SpotLight(0x8c1c03);
		spotLight2.intensity = 0.7;
		spotLight2.position.set(10, -10, 30);
		spotLight2.lookAt(ball2);
		spotLight2.castShadow = true;
		scene.add(spotLight2);

		const spotLight3 = new THREE.SpotLight(0xFF0000);
		spotLight3.intensity = 0.5;
		spotLight3.position.set(-10, -10, 10);
		spotLight3.lookAt(ball2);
		spotLight3.castShadow = true;
		scene.add(spotLight3);

		const spotLight4 = new THREE.SpotLight(0xffffff);
		spotLight4.intensity = 0.2;
		spotLight4.position.set(10, -30, 20);
		spotLight4.lookAt(ball);
		spotLight4.castShadow = true;
		scene.add(spotLight4);


		scene.add(group);

		document.getElementById('out').appendChild(renderer.domElement);

		window.addEventListener('resize', onWindowResize, false);
		window.addEventListener('click', onMouseClick);
		window.addEventListener('keydown', ()=>{
			 changeChanger();
			colorChanger();
		});

		colorChanger();
		render();

		function render(){
			analyser.getByteFrequencyData(dataArray);

			const lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
			const upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);

			
			const lowerMax = max(lowerHalfArray);
			const lowerAvg = avg(lowerHalfArray);
			const upperMax = max(upperHalfArray);
			const upperAvg = avg(upperHalfArray);

			const lowerMaxFr = lowerMax / lowerHalfArray.length;
			const lowerAvgFr = lowerAvg / lowerHalfArray.length;
			const upperMaxFr = upperMax / upperHalfArray.length;
			const upperAvgFr = upperAvg / upperHalfArray.length;

			// groundAnimation(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));
			// groundAnimation(plane, modulate(lowerMaxFr, 0, 1, 0.5, 4));

			
			ballAnimation(ball, modulate(Math.pow(lowerMaxFr, .5), 0, 1, 0, 8), modulate(upperMaxFr, 0, 1, 0, 4));
			ballAnimation(ball2, modulate(Math.pow(lowerAvgFr, .4), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));

			ball.rotation.y += 0.005;
			ball2.rotation.y -= 0.005;
			
			renderer.render(scene, camera);
			
			
			
			requestAnimationFrame(render);
		}

		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}

		function colorChanger(){
			if (changer === true){
				ambientLight.color = new THREE.Color(colors[0]);
				colors.unshift(colors.pop());
				// requestAnimationFrame(colorChanger);
				setTimeout(colorChanger, 750);
			}
		}

		function changeChanger(){
			changer = !changer;
		}

		function onMouseClick(){
			ambientLight.color = new THREE.Color(colors[i]);
			i = (i +1)% colors.length;
		}
	
		function ballAnimation(ball, bass, tre) {
			ball.geometry.vertices.forEach(function (vertex, i) {
				const offset = ball.geometry.parameters.radius;
				const amp = 10;
				const time = window.performance.now();
				vertex.normalize();
				const rf = 0.0001;
				const distance = (offset + bass ) + noise.noise3D(vertex.x + time *rf*7, vertex.x +  time*rf*8, vertex.z + time*rf*9) * amp * tre;
				vertex.multiplyScalar(distance);
			});
			ball.geometry.verticesNeedUpdate = true;
			ball.geometry.normalsNeedUpdate = true;
			ball.geometry.computeVertexNormals();
			ball.geometry.computeFaceNormals();
		}
	
		// function groundAnimation(mesh, distortionFr) {
		// 	mesh.geometry.vertices.forEach(function (vertex, i) {
		// 		const amp = 2;
		// 		const time = Date.now();
		// 		const distance = (noise.noise2D(vertex.x + time * 0.003, vertex.y + time * 0.0001) + 0) * distortionFr * amp;
		// 		vertex.z = distance;
		// 	});
		// 	mesh.geometry.verticesNeedUpdate = true;
		// 	mesh.geometry.normalsNeedUpdate = true;
		// 	mesh.geometry.computeVertexNormals();
		// 	mesh.geometry.computeFaceNormals();
		// }
	
		audio.play();
	}
};

window.onload = init();

document.body.addEventListener('touchend', function(ev) { context.resume(); });



function divide(val, minVal, maxVal) {
    return (val - minVal)/(maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
    const fr = divide(val, minVal, maxVal);
    const delta = outMax - outMin;
    return outMin + (fr * delta);
}

function avg(arr){
	let total = 0
	for(let i = 0; i < arr.length; i++){total += arr[i]}
    return (total / arr.length);
}

function max(arr){
    return Math.max(...arr)
}
