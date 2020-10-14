let changer = true;

export function colorChanger(){
    if (changer === true){
        ambientLight.color = new THREE.Color(colors[0]);
        colors.unshift(colors.pop());
        // requestAnimationFrame(colorChanger);
        setTimeout(colorChanger, 750);
    }
}

export function changeChanger(){
    changer = !changer;
}

export function onMouseClick(){
    ambientLight.color = new THREE.Color(colors[i]);
    i = (i +1)% colors.length;
}