import DrawingElement from './DrawingElement.js';

const toolbar = document.querySelector('.toolbar');
const colorInput = document.querySelector('#color');
const c = document.querySelector('canvas#main');
const ctx = c.getContext('2d');

let startX = 0;
let startY = 0;

ctx.lineWidth = 5;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.globalCompositeOperation = 'source-over'

let isDrawing = false;
let tool = 'line';
let currentPath = null;

let paths = JSON.parse(c.getAttribute('data-paths')) || [];
const history = [];

if (paths.length != 0) {
  paths = paths.map(p => new DrawingElement(p.type, p.color, p.paths));
  drawPaths(paths);
}

colorInput.addEventListener('input', (e) => {
  ctx.strokeStyle = e.target.value;
});

toolbar.addEventListener('click', (e) => {
  if (e.target.matches('#save')) {
    const pathData = JSON.stringify(paths);
    const drawingName = document.querySelector('#drawingName').value;
    $.post("/api/drawings", { name: drawingName, link: pathData, userId: 1 }).then(response => {
      console.log(response);
    }).catch((error) => {
      // TODO: actually handle the error.
    });
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
    let x = e.offsetX;
    let y = e.offsetY;

    ctx.clearRect(0, 0, c.width, c.height);
    drawPaths(paths);
    ctx.save();
    if (tool == 'square') {
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, startY, x - startX, y - startY);
    } else if (tool == 'line') {
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      currentPath.push([x, y]);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.restore();
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
  if (isDrawing) {
    isDrawing = false;
    let endX = e.offsetX;
    let endY = e.offsetY;
    currentPath.push([endX, endY]);
    paths.push(new DrawingElement(tool, ctx.strokeStyle, currentPath));
    currentPath = null;
    drawPaths(paths);
  }
}

function drawPaths(paths) {
  ctx.clearRect(0, 0, c.width, c.height)
  paths.forEach(el => {
    ctx.save();
    ctx.strokeStyle = el.color;
    ctx.stroke(el.toPath2D());
    ctx.restore();
  });
}
