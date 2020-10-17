// import * as THREE from 'three';
// const SimplexNoise = require('simplex-noise');
// const noise = new SimplexNoise();
const cors = require('cors');
import {sphere} from './sphere';


const init = function(){
	const file = document.getElementById('thefile');
	let audio = document.getElementById('audio');
	const fileLabel = document.querySelector('label.file');
	const button = document.getElementById('secondfile');


	document.onload = function(e){
		console.log(e);
		audio.play();
		sphere();
	};

	file.onchange = function(){
		fileLabel.classList.add('normal');
		button.classList.add('normal');
		audio.classList.add('active');
		const files = this.files;

		audio.src = URL.createObjectURL(files[0]);
		audio.load();
		audio.play();
		sphere();
	};

	function demoSong(){
		
		audio.crossOrigin= 'anonymous';
		audio.src = 'https://raw.githubusercontent.com/AAfghahi/Visualize/master/dist/media/song.mp3';
		button.classList.add('normal');
		fileLabel.classList.add('normal');
		
	}


	document.getElementById('secondfile').onclick = function(){
		demoSong();
		audio.play();
		sphere();
	};

	audio.play();
};

window.onload = init();

document.body.addEventListener('touchend', function(ev) { context.resume(); });




