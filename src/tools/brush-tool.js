import BaseTool from './base-tool.js';

export default class BrushTool extends BaseTool {
  constructor(drawer) {
    super(drawer);
    this.name = 'brush';
    this.points = [];
  }

  _onMouseDown({ point, event }) {
    this.isDrawing = true;
    this.points = [point];
    
    this.currentShape = this._createShape('brush', {
      points: [point],
      isComplete: false
    });

    // 开始绘制路径
    this.drawer.ctx.beginPath();
    this.drawer.ctx.moveTo(point.x, point.y);
  }

  _onMouseMove({ point, event }) {
    if (!this.isDrawing) return;

    this.points.push(point);
    this.currentShape.data.points = this.points;

    // 绘制实时路径
    this.drawer.ctx.lineTo(point.x, point.y);
    this.drawer.ctx.stroke();
  }

  _onMouseUp({ point, event }) {
    if (!this.isDrawing) return;

    this.isDrawing = false;
    this.currentShape.data.isComplete = true;
    this.currentShape.data.points = [...this.points];
    
    // 添加最终图形
    if (this.points.length > 1) {
      this.drawer.addShape(this.currentShape);
    }
    
    this.points = [];
    this.currentShape = null;
  }

  _unbindEvents() {
    this.isDrawing = false;
    this.points = [];
    this.currentShape = null;
    this.drawer.resetEvent();
  }
}
