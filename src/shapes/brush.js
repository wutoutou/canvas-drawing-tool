import Shape from './Shape.js';

export default class Brush extends Shape {
  constructor(id, data) {
    super(id, 'brush', data);
  }

  draw(ctx) {
    if (this.data.points.length < 2) return;

    ctx.save();
    ctx.strokeStyle = this.data.color;
    ctx.lineWidth = this.data.lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.data.points[0].x, this.data.points[0].y);
    
    for (let i = 1; i < this.data.points.length; i++) {
      ctx.lineTo(this.data.points[i].x, this.data.points[i].y);
    }
    
    ctx.stroke();
    ctx.restore();
  }

  containsPoint(point, tolerance = 5) {
    const { points, lineWidth } = this.data;
    if (points.length < 2) return false;

    // 检查点是否在笔划附近
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      const distance = this._pointToLineDistance(point, prev, curr);
      if (distance <= lineWidth / 2 + tolerance) {
        return true;
      }
    }
    return false;
  }

  _pointToLineDistance(point, lineStart, lineEnd) {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
