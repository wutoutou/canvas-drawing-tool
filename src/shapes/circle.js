import Shape from './Shape.js';

export default class Circle extends Shape {
  constructor(id, data) {
    super(id, 'circle', data);
  }

  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = this.data.color;
    ctx.lineWidth = this.data.lineWidth;
    ctx.beginPath();
    ctx.arc(this.data.x, this.data.y, this.data.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  containsPoint(point, tolerance = 5) {
    const { x, y, radius } = this.data;
    const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
    return distance <= radius + tolerance;
  }
}
