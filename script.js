const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const croppedCanvas = document.getElementById('croppedCanvas');
const croppedCtx = croppedCanvas.getContext('2d');

let img = new Image();
img.src = 'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp'; // Replace with your image URL

img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

let isDragging = false;
let startX, startY, endX, endY;

canvas.addEventListener('mousedown', (e) => {
    startX = e.offsetX;
    startY = e.offsetY;
    isDragging = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        endX = e.offsetX;
        endY = e.offsetY;
        drawSelection();
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    cropAndDisplay();
});

canvas.addEventListener('mouseout', () => {
    isDragging = false;
});

function drawSelection() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
}

function cropAndDisplay() {
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    if (width && height) {
        croppedCanvas.width = width;
        croppedCanvas.height = height;
        croppedCtx.drawImage(img, startX, startY, width, height, 0, 0, width, height);
    }
}
