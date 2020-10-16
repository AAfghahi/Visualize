export function divide(val, minVal, maxVal) {
    return (val - minVal)/(maxVal - minVal);
}

export function modulate(val, minVal, maxVal, outMin, outMax) {
    const fr = divide(val, minVal, maxVal);
    const delta = outMax - outMin;
    return outMin + (fr * delta);
}

export function avg(arr){
	let total = 0
	for(let i = 0; i < arr.length; i++){total += arr[i]}
    return (total / arr.length);
}

export function max(arr){
    return Math.max(...arr)
}