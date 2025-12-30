import Shape from './Shape.js';

export default class Polygon extends Shape {
  constructor(id, data) {
    super(id, 'polygon', data);
  }

  draw(ctx) {
    if (this.data.points.length < 3) return;

    ctx.save();
    ctx.strokeStyle = this.data.color;
    ctx.lineWidth = this.data.lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.data.points[0].x, this.data.points[0].y);
    
    for (let i = 1; i < this.data.points.length; i++) {
      ctx.lineTo(this.data.points[i].x, this.data.points[i].y);
    }
    
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  containsPoint(point, tolerance = 5) {
    const { points } = this.data;
    if (points.length < 3) return false;

    // 使用射线法判断点是否在多边形内
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const xi = points[i].x, yi = points[i].y;
      const xj = points[j].x, yj = points[j].y;
      
      const intersect = ((yi > point.y) !== (yj > point.y)) &&
        (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      
      if (intersect) inside = !inside;
    }
    
    return inside;
  }
}
