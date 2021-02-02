export default class DrawingElement {
  constructor(type, color, paths) {
    this.type = type;
    this.color = color;
    this.paths = paths;
  }

  toPath2D() {
    const path = new Path2D();
    const start = this.paths[0];
    const end = this.paths[1];

    if (this.type == 'circle' || this.type == 'circle-filled') {
      const radius = Math.sqrt((end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2);
      path.arc(start[0], start[1], radius, 0, Math.PI * 2);
      return path;
    }

    path.moveTo(start[0], start[1]);

    if (this.type === 'line') {
      path.lineTo(end[0], end[1]);
    } else if (this.type === 'square' || this.type === 'square-filled') {
      path.rect(start[0], start[1], end[0] - start[0], end[1] - start[1]);
    } else {
      for (let i = 1; i < this.paths.length; i++) {
        path.lineTo(this.paths[i][0], this.paths[i][1]);
      }
    }
    return path;
  }
}
