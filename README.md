## Visualize

Visualize is a Sound Visualizer using Canvas, Web Audio, and three.js. It allows you to load up any song that you wish, or use the demo song provided, to see the 3D object respond to the Bass and Treble frequency. 

## Technologies Used
+ Javascript
+ HTML
+ Canvas
+ Web Audio API
+ Three.JS API
+ Simplex Noise 

## Features 

### 3D Model
+ Using Three.js, the visualizer (currently) renders two three dimension Icosahedron that change based on the frenquency levels of the audio that is playing. 
+ Any uploaded audio is analysed using Web Audio API for the frequency levels, which are then converted into a frequency histogram and spliced into high and low frequencies. 
+ Higher frequencies change the patterning of the polygon, while the lower frequencies change the size of the polygon. 
+ Frequencies are analyzed in 2048 fft in order to create to ensure that the inner sphere is kept smooth. 

 ![alt text](https://github.com/AAfghahi/Visualize/blob/master/dist/media/Peek%202020-10-19%2012-05.gif)

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
}

### USer Manipulation 

+ Users are able to change the colors of the sphere by pressing 'c' and toggle the auto color shift by pressing 'a.' 
+ There are also orbital controls that allow you to use your mouse to rotate the screen and to zoom in and out of the image.

 ![alt text](https://github.com/AAfghahi/Visualize/blob/master/dist/media/Peek%202020-10-19%2012-10.gif)
 
~~~
function colorChanger(){
        if (changer === true){
            ambientLight.color = new THREE.Color(colors[0]);
            colors.unshift(colors.pop());
            if (modulate(Math.pow(beat, 1.1), 0, 1, 0, 16) < 500){
                setTimeout(colorChanger, 750);	
            }else{
                setTimeout(colorChanger, modulate(Math.pow(beat, 1.1), 0, 1, 0, 16));
            }
        }
    }

function changeChanger(){
        changer = !changer;
    }

function onMouseClick(){
   
    i = (i +1) % colors.length;
     ambientLight.color = new THREE.Color(colors[i]);
 }
 ~~~
