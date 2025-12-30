import BaseTool from './base-tool.js';
import { isPointInPolygon } from '../utils/index';;

export default class PolygonTool extends BaseTool {
  constructor(drawer) {
    super(drawer);
    this.name = 'polygon';
    this.points = [];
    this.isComplete = false;
  }

  _onMouseDown({ point, event }) {
    if (this.isComplete) return;

    if (!this.isDrawing) {
      // 开始绘制多边形
      this.isDrawing = true;
      this.points = [point];
      
      this.currentShape = this._createShape('polygon', {
        points: [point],
        isComplete: false
      });
    } else {
      // 添加新顶点
      this.points.push(point);
      this.currentShape.data.points = this.points;
      
      this._drawPreview();
    }
  }

  _onMouseMove({ point, event }) {
    if (!this.isDrawing || this.isComplete) return;

    this._drawPreview(point);
  }

  _onDoubleClick({ point, event }) {
    if (this.isDrawing && !this.isComplete && this.points.length >= 2) {
      this._completePolygon();
    }
  }

  _completePolygon() {
    this.isComplete = true;
    this.currentShape.data.isComplete = true;
    this.currentShape.data.points = [...this.points];
    
    // 添加最终图形（至少3个点才构成多边形）
    if (this.points.length >= 3) {
      this.drawer.addShape(this.currentShape);
    }
    
    this._reset();
  }

  _drawPreview(currentPoint = null) {
    // 清空画布并重绘所有图形
    this.drawer.ctx.clearRect(0, 0, this.drawer.canvas.width, this.drawer.canvas.height);
    
    // 绘制已保存的图形
    this.drawer.getShapes().forEach(shape => {
      shape.draw(this.drawer.ctx);
    });
    
    if (this.points.length === 0) return;

    // 绘制预览多边形
    this.drawer.ctx.save();
    this.drawer.ctx.strokeStyle = this.currentShape.data.color;
    this.drawer.ctx.lineWidth = this.currentShape.data.lineWidth;
    this.drawer.ctx.setLineDash([5, 5]);
    
    this.drawer.ctx.beginPath();
    this.drawer.ctx.moveTo(this.points[0].x, this.points[0].y);
    
    // 绘制已确定的边
    for (let i = 1; i < this.points.length; i++) {
      this.drawer.ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    
    // 绘制当前预览边
    if (currentPoint && this.points.length > 0) {
      const lastPoint = this.points[this.points.length - 1];
      this.drawer.ctx.lineTo(currentPoint.x, currentPoint.y);
      
      // 绘制闭合预览线
      // this.drawer.ctx.moveTo(currentPoint.x, currentPoint.y);
    }

    this.drawer.ctx.lineTo(this.points[0].x, this.points[0].y);
    this.drawer.ctx.stroke();
    this.drawer.ctx.restore();
  }

  _reset() {
    this.isDrawing = false;
    this.isComplete = false;
    this.points = [];
    this.currentShape = null;
    this.drawer.resetEvent();
  }

  _unbindEvents() {
    this._reset();
  }

  containsPoint(point, tolerance = 5) {
    return isPointInPolygon(point, this.data.points);
  }
}
