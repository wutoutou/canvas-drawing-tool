import BaseTool from './base-tool.js';
import { isPointInCircle } from '../utils/index';;

export default class CircleTool extends BaseTool {
  constructor(drawer) {
    super(drawer);
    this.name = 'circle';
    this.centerPoint = null;
    this.radius = 0;
  }

  _onMouseDown({ point, event }) {
    this.isDrawing = true;
    this.centerPoint = point;
    this.radius = 0;

    this.currentShape = this._createShape('circle', {
      x: point.x,
      y: point.y,
      radius: 0
    });
  }

  _onMouseMove({ point, event }) {
    if (!this.isDrawing) return;

    const dx = point.x - this.centerPoint.x;
    const dy = point.y - this.centerPoint.y;
    this.radius = Math.sqrt(dx * dx + dy * dy);

    this.currentShape.data.radius = this.radius;

    this._drawPreview();
  }

  _onMouseUp({ point, event }) {
    if (!this.isDrawing) return;

    this.isDrawing = false;
    
    // 添加最终图形（半径大于2像素才保存）
    if (this.radius > 2) {
      this.drawer.addShape(this.currentShape);
    }
    
    this.centerPoint = null;
    this.radius = 0;
    this.currentShape = null;
  }

  _drawPreview() {
    // 清空画布并重绘所有图形
    this.drawer.ctx.clearRect(0, 0, this.drawer.canvas.width, this.drawer.canvas.height);
    
    // 绘制已保存的图形
    this.drawer.getShapes().forEach(shape => {
      shape.draw(this.drawer.ctx);
    });
    
    // 绘制预览圆形（虚线）
    this.drawer.ctx.save();
    this.drawer.ctx.strokeStyle = this.currentShape.data.color;
    this.drawer.ctx.lineWidth = this.currentShape.data.lineWidth;
    this.drawer.ctx.setLineDash([5, 5]);
    
    this.drawer.ctx.beginPath();
    this.drawer.ctx.arc(
      this.centerPoint.x,
      this.centerPoint.y,
      this.radius,
      0,
      Math.PI * 2
    );
    this.drawer.ctx.stroke();
    
    this.drawer.ctx.restore();
  }

  _unbindEvents() {
    this.isDrawing = false;
    this.centerPoint = null;
    this.radius = 0;
    this.currentShape = null;
    this.drawer.resetEvent();
  }

  containsPoint(point, tolerance = 5) {
    return isPointInCircle(point, this.data, tolerance);
  }
}
