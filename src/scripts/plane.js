import * as THREE from 'three';
const SimplexNoise = require('simplex-noise');
const noise = new SimplexNoise();
import {modulate, avg, max} from './functions';


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

     // groundAnimation(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));
        // groundAnimation(plane, modulate(lowerMaxFr, 0, 1, 0.5, 4));



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