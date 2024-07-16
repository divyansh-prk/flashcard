const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const croppedCanvas = document.getElementById('croppedCanvas');
const croppedCtx = croppedCanvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const extractButton = document.getElementById('extractText');
const extractedTextDiv = document.getElementById('extractedText');

let img = new Image();
let isDragging = false;
let startX, startY, endX, endY;

imageUpload.addEventListener('change', handleImage, false);
extractButton.addEventListener('click', extractText);

function handleImage(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

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

function extractText() {
    Tesseract.recognize(
        croppedCanvas,
        'eng',
        { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        extractedTextDiv.textContent = text;
    })
}