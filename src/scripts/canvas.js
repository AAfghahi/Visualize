window.onload = function(){
    const file = document.getElementById('thefile');
    const audio = document.getElementById('audio');

    file.onchange = function(){
        const files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
        const context = new AudioContext();
        const src = context.createMediaElementSource(audio);
        const analyser = context.createAnalyser();

        const canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');

        src.connect(analyser);
        analyser.connect(context.destination);
        analyser.fftSize = 256;

        const bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);

        const dataArray = new Uint8Array(bufferLength);

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        let barWidth = (WIDTH/ bufferLength) * 2.5;
        // const barHeight;
        let x = 0;

        function renderFrame(){
            requestAnimationFrame(renderFrame);

            x = 0;

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                
                let r = barHeight + (25 * (i/bufferLength));
                let g = 250 * (i/bufferLength);
                let b = 50;

                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        }
        audio.play();
    renderFrame();
    };
};