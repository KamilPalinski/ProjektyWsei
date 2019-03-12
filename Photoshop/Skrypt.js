let canvas;
let canvasCtx;
let originalPixels;
let processedPixels;
let brightnessInput;
let contrastInput;
let blurInput;
let image;

let IMAGE_URL = './obrazki/img.jpg';

initCanvas();
initInputs();
loadImageToCanvas();

function initCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = 'canvas-scene';
    canvas.width = 1024;
    canvas.height = 512;

    canvasCtx = canvas.getContext('2d');

    document.querySelector('#canvas-container').appendChild(canvas);
}

function loadImageToCanvas() {
    image = new Image();
    image.src = IMAGE_URL;
    image.addEventListener('load', event => {
        canvasCtx.drawImage(image, 0, 0, canvas.width, canvas.height);
        originalPixels = canvasCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    });
}

function initInputs() {
    brightnessInput = document.querySelector('#brightness');
    contrastInput = document.querySelector('#contrast');
    blurInput = document.querySelector('#blur');

    brightnessInput.addEventListener('change', applyFilters);
    contrastInput.addEventListener('change', applyFilters);
    blurInput.addEventListener('change', applyFilters);
}

function applyFilters() {
    processedPixels = [...originalPixels];

    applyBrightness();
    applyContrast();
    applyBlur();
}

function applyBrightness() {
    const adjustment = 200 * brightnessInput.value;
    const imageData = canvasCtx.createImageData(canvas.width, canvas.height);

    for (let i = 0; i < processedPixels.length; i += 4) {
        processedPixels[i] = truncateColor(processedPixels[i] + adjustment);
        processedPixels[i + 1] = truncateColor(processedPixels[i + 1] + adjustment);
        processedPixels[i + 2] = truncateColor(processedPixels[i + 2] + adjustment);
    }

    imageData.data.set(processedPixels);
    canvasCtx.putImageData(imageData, 0, 0);
}

function applyContrast() {
    const contrast = 100 * contrastInput.value;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    const imageData = canvasCtx.createImageData(canvas.width, canvas.height);

    for (let i = 0; i < processedPixels.length; i += 4) {
        processedPixels[i] = truncateColor(factor * (processedPixels[i] - 128.0) + 128.0);
        processedPixels[i + 1] = truncateColor(factor * (processedPixels[i + 1] - 128.0) + 128.0);
        processedPixels[i + 2] = truncateColor(factor * (processedPixels[i + 2] - 128.0) + 128.0);
    }

    imageData.data.set(processedPixels);
    canvasCtx.putImageData(imageData, 0, 0);
}

function applyBlur() {
    const blur = blurInput.value;
    const imageData = canvasCtx.createImageData(canvas.width, canvas.height);

    if (blur > 0) {
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                let acc = [];

                for (let xk = -blur; xk < blur; xk++) {
                    for (let yk = -blur; yk < blur; yk++) {
                        const pixel = getPixelData(processedPixels, x + xk, y + yk, canvas.width);
                        if (pixel) {
                            acc.push(pixel);
                        }
                    }
                }

                const aggregated = acc.reduce((acc, item) => ({
                    r: (acc.r || 0) + item.r,
                    g: (acc.g || 0) + item.g,
                    b: (acc.b || 0) + item.b,
                    a: (acc.a || 0) + item.a
                }), {});

                const averaged = {
                    r: Math.round(aggregated.r / acc.length),
                    g: Math.round(aggregated.g / acc.length),
                    b: Math.round(aggregated.b / acc.length),
                    a: 255
                };

                let position = (x + y * canvas.width) * 4;
                processedPixels[position] = averaged.r;
                processedPixels[position+1] = averaged.g;
                processedPixels[position+2] = averaged.b;
                processedPixels[position+3] = averaged.a;
            }
        }
    }

    imageData.data.set(processedPixels);
    canvasCtx.putImageData(imageData, 0, 0);
}

function getPixelData(pixelData, x, y, imageWidth) {
    let pos = (x + imageWidth * y) * 4;

    return pixelData[ pos ] ? {
        r : pixelData[ pos ],
        g : pixelData[ pos + 1 ],
        b : pixelData[ pos + 2 ],
        a : pixelData[ pos + 3 ]
    } : null;
}

function truncateColor(value) {
    if (value < 0) {
        value = 0;
    } else if (value > 255) {
        value = 255;
    }

    return value;
}
