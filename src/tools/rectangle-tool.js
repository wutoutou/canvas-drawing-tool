import BaseTool from './base-tool.js';
import { isPointInRect } from '../utils/index';

export default class RectangleTool extends BaseTool {
  constructor(drawer) {
    super(drawer);
    this.name = 'rectangle';
    this.startPoint = null;
  }

  _onMouseDown({ point, event }) {
    this.isDrawing = true;
    this.startPoint = point;
    
    this.currentShape = this._createShape('rectangle', {
      x: point.x,
      y: point.y,
      width: 0,
      height: 0
    });
  }

  _onMouseMove({ point, event }) {
    if (!this.isDrawing) return;

    const width = point.x - this.startPoint.x;
    const height = point.y - this.startPoint.y;

    // 更新当前形状数据
    this.currentShape.data.width = width;
    this.currentShape.data.height = height;

    // 重绘画布（包括预览）
    this._drawPreview();
  }

  _onMouseUp({ point, event }) {
    if (!this.isDrawing) return;

    this.isDrawing = false;
    
    // 添加最终图形
    if (Math.abs(this.currentShape.data.width) > 2 && 
        Math.abs(this.currentShape.data.height) > 2) {
      this.drawer.addShape(this.currentShape);
    }
    
    this.currentShape = null;
    this.startPoint = null;
  }

  _drawPreview() {
    // 清空画布并重绘所有图形
    this.drawer.ctx.clearRect(0, 0, this.drawer.canvas.width, this.drawer.canvas.height);
    
    // 绘制已保存的图形
    this.drawer.getShapes().forEach(shape => {
      shape.draw(this.drawer.ctx);
    });
    
    // 绘制预览矩形（虚线）
    this.drawer.ctx.save();
    this.drawer.ctx.strokeStyle = this.currentShape.data.color;
    this.drawer.ctx.lineWidth = this.currentShape.data.lineWidth;
    this.drawer.ctx.setLineDash([5, 5]);
    
    this.drawer.ctx.strokeRect(
      this.currentShape.data.x,
      this.currentShape.data.y,
      this.currentShape.data.width,
      this.currentShape.data.height
    );
    
    this.drawer.ctx.restore();
  }

  _unbindEvents() {
    this.isDrawing = false;
    this.currentShape = null;
    this.startPoint = null;
    this.drawer.resetEvent();
  }

  containsPoint(point, tolerance = 5) {
    return isPointInRect(point, this.data, tolerance);
  }
}
