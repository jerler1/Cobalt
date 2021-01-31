import DrawingElement from './DrawingElement.js';

const toolbar = document.querySelector('.toolbar');
const colorInput = document.querySelector('#color');
const c = document.querySelector('canvas#main');
const cBackground = document.querySelector('canvas#background');
const ctx = c.getContext('2d');
const backgroundCtx = cBackground.getContext('2d');

let startX = 0;
let startY = 0;

ctx.lineWidth = 5;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.globalCompositeOperation = 'source-over'

backgroundCtx.setLineDash([5, 5]);

let isDrawing = false;
let tool = 'line';
let currentPath = null;

const paths = [];
const history = [];

colorInput.addEventListener('input', (e) => {
  ctx.strokeStyle = e.target.value;
});

toolbar.addEventListener('click', (e) => {
  if (e.target.matches('#save')) {
    const dataUrl = c.toDataURL();
    console.log(dataUrl);
    console.log(dataUrl.length);
  } else if (e.target.matches('#undo')) {
    if (paths.length == 0) {
      return;
    }
    history.push(paths.pop());
    drawPaths(paths);
  } else if (e.target.matches('#redo')) {
    if (history.length == 0) {
      return;
    }
    paths.push(history.pop());
    drawPaths(paths);
  } else if (e.target.matches('button[data-tool]')) {
    tool = e.target.getAttribute('data-tool');
  }
});
c.addEventListener('pointerdown', onMouseDown);
c.addEventListener('pointermove', onMouseMove);
c.addEventListener('pointerup', onMouseUp);

// Necessary to prevent scrolling when trying to draw on mobile.
c.addEventListener('touchstart', (e) => {
  e.preventDefault();
});

function onMouseMove(e) {
  if (isDrawing) {
    if (tool == 'square') {
      backgroundCtx.clearRect(0, 0, cBackground.width, cBackground.height);
      backgroundCtx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
    } else if (tool == 'line') {
      backgroundCtx.clearRect(0, 0, cBackground.width, cBackground.height);
      backgroundCtx.beginPath();
      backgroundCtx.moveTo(startX, startY);
      backgroundCtx.lineTo(e.offsetX, e.offsetY);
      backgroundCtx.stroke();
      // backgroundCtx.closePath();
    } else {
      let x = e.offsetX;
      let y = e.offsetY;
      currentPath.push([x, y]);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }
}

function onMouseDown(e) {
  ctx.beginPath();
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
  currentPath = [[startX, startY]];
}

function onMouseUp(e) {
  isDrawing = false;
  let endX = e.offsetX;
  let endY = e.offsetY;
  currentPath.push([endX, endY]);
  paths.push(new DrawingElement(tool, ctx.strokeStyle, currentPath));
  currentPath = null;
  drawPaths(paths);
}

function drawPaths(paths) {
  backgroundCtx.clearRect(0, 0, cBackground.width, cBackground.height);
  ctx.clearRect(0, 0, c.width, c.height)
  paths.forEach(el => {
    ctx.save();
    ctx.strokeStyle = el.color;
    ctx.stroke(el.toPath2D());
    ctx.restore();
  });
}
