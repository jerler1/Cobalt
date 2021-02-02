import DrawingElement from './DrawingElement.js';

const toolbar = document.querySelector('.toolbar');
const ownerControls = document.querySelector('.owner-controls');
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

if (ownerControls != null) {
  const drawingId = ownerControls.getAttribute('data-drawingid');
  const userId = ownerControls.getAttribute('data-userid');
  ownerControls.addEventListener('click', (e) => {
    if (e.target.matches('#owner-save')) {
      const pathData = JSON.stringify(paths);
      const drawingName = document.querySelector('#drawingName').value;
      const link  = c.toDataURL();
      $.ajax(`/api/drawings/${drawingId}`, {
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ name: drawingName, link, data: pathData, userId }),
      }).then(response => {
        console.log(response);
        // Pop up a notification or something that says saved?
        alert('Drawing updated successfully.');
      }).catch((error) => {
        // TODO: Actually handle any error.
      });
    } else if (e.target.matches('#owner-delete')) {
      const willDelete = confirm("Are you sure? This can't be undone!");
      if (willDelete) {
        $.ajax(`/api/drawings/${drawingId}`, {
          method: 'DELETE'
        }).then((response) => {
          // Temporary. Where should we actually navigate to?
          location.href = '../';
        }).catch((error) => {
          // TODO: Actually handle any error.
        });
      }
    }
  });
}

toolbar.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', handleButtonClick);
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
    if (tool == 'square' || tool == 'square-filled') {
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, startY, x - startX, y - startY);
    } else if (tool == 'circle' || tool == 'circle-filled') {
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1;
      const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      ctx.stroke();
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
    ctx.fillStyle = el.color;
    if (el.type == 'circle-filled' || el.type == 'square-filled') {
      ctx.fill(el.toPath2D());
    } else {
      ctx.stroke(el.toPath2D());
    }
    ctx.restore();
  });
}

function handleButtonClick(e) {
  if (e.currentTarget.matches('#save')) {
    const pathData = JSON.stringify(paths);
    const drawingName = document.querySelector('#drawingName').value;
    const userId = e.currentTarget.getAttribute('data-userid');
    const link  = c.toDataURL();
    $.post("/api/drawings", { name: drawingName, link, data: pathData, userId }).then(response => {
      console.log(response);
      location.href = `/${response.user.userName}/drawing/${response.drawing.id}`;
    }).catch((error) => {
      // TODO: actually handle the error.
    });
  } else if (e.currentTarget.matches('#undo')) {
    if (paths.length == 0) {
      return;
    }
    history.push(paths.pop());
    drawPaths(paths);
  } else if (e.currentTarget.matches('#redo')) {
    if (history.length == 0) {
      return;
    }
    paths.push(history.pop());
    drawPaths(paths);
  } else if (e.currentTarget.matches('button[data-tool]')) {
    tool = e.currentTarget.getAttribute('data-tool');
  }
}