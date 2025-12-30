import Shape from './Shape.js';

export default class Rectangle extends Shape {
  constructor(id, data) {
    super(id, 'rectangle', data);
  }

  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = this.data.color;
    ctx.lineWidth = this.data.lineWidth;
    ctx.strokeRect(this.data.x, this.data.y, this.data.width, this.data.height);
    ctx.restore();
  }

  containsPoint(point, tolerance = 5) {
    const { x, y, width, height } = this.data;
    return point.x >= x - tolerance && 
           point.x <= x + width + tolerance && 
           point.y >= y - tolerance && 
           point.y <= y + height + tolerance;
  }
}
