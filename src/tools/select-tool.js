import BaseTool from './base-tool.js';
import { 
  isPointInRect, 
  isPointInCircle, 
  isPointInPolygon,
  pointToLineDistance 
} from '../utils/index';

export default class SelectTool extends BaseTool {
  constructor(drawer) {
    super(drawer);
    this.name = 'select';
    this.selectedShape = null;
    this.isDragging = false;
    this.dragStartPoint = null;
    this.originalShapePosition = null;
  }

  _onMouseDown({ point, event }) {
    // 检查是否点击了图形
    const clickedShape = this._findShapeAtPoint(point);
    
    if (clickedShape) {
      this.selectedShape = clickedShape;
      this.isDragging = true;
      this.dragStartPoint = point;
      this.originalShapePosition = this._getShapePosition(clickedShape);
      
      // 触发选中事件
      this.drawer.eventManager.emit('shapeSelected', { 
        shape: clickedShape, 
        point 
      });
      
      this._drawSelectionHighlight();
    } else {
      this._clearSelection();
    }
  }

  _onMouseMove({ point, event }) {
    if (!this.isDragging || !this.selectedShape) return;

    const dx = point.x - this.dragStartPoint.x;
    const dy = point.y - this.dragStartPoint.y;
    
    this._moveShape(this.selectedShape, dx, dy);
    this.dragStartPoint = point;
    
    this._redrawCanvas();
    this._drawSelectionHighlight();
  }

  _onMouseUp({ point, event }) {
    if (this.isDragging && this.selectedShape) {
      this.drawer.eventManager.emit('shapeMoved', { 
        shape: this.selectedShape, 
        from: this.originalShapePosition, 
        to: this._getShapePosition(this.selectedShape) 
      });
    }
    
    this.isDragging = false;
    this.dragStartPoint = null;
    this.originalShapePosition = null;
  }

  _findShapeAtPoint(point, tolerance = 5) {
    const shapes = this.drawer.getShapes();
    
    // 从后往前检查（最后绘制的在最上面）
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      if (this._isPointInShape(point, shape, tolerance)) {
        return shape;
      }
    }
    
    return null;
  }

  _isPointInShape(point, shape, tolerance) {
    switch (shape.type) {
      case 'rectangle':
        return isPointInRect(point, shape.data, tolerance);
      case 'circle':
        return isPointInCircle(point, shape.data, tolerance);
      case 'polygon':
        return isPointInPolygon(point, shape.data.points);
      case 'brush':
        return this._isPointInBrush(point, shape.data, tolerance);
      default:
        return false;
    }
  }

  _isPointInBrush(point, brushData, tolerance) {
    const { points, lineWidth } = brushData;
    if (points.length < 2) return false;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      const distance = pointToLineDistance(point, prev, curr);
      if (distance <= lineWidth / 2 + tolerance) {
        return true;
      }
    }
    return false;
  }

  _moveShape(shape, dx, dy) {
    switch (shape.type) {
      case 'rectangle':
        shape.data.x += dx;
        shape.data.y += dy;
        break;
      case 'circle':
        shape.data.x += dx;
        shape.data.y += dy;
        break;
      case 'polygon':
        shape.data.points.forEach(point => {
          point.x += dx;
          point.y += dy;
        });
        break;
      case 'brush':
        shape.data.points.forEach(point => {
          point.x += dx;
          point.y += dy;
        });
        break;
    }
  }

  _getShapePosition(shape) {
    switch (shape.type) {
      case 'rectangle':
        return { x: shape.data.x, y: shape.data.y };
      case 'circle':
        return { x: shape.data.x, y: shape.data.y };
      case 'polygon':
        // 返回多边形的中心点（近似）
        const points = shape.data.points;
        const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
        const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
        return { x: centerX, y: centerY };
      case 'brush':
        // 返回笔划的起点
        const firstPoint = shape.data.points[0];
        return { x: firstPoint.x, y: firstPoint.y };
      default:
        return { x: 0, y: 0 };
    }
  }

  _drawSelectionHighlight() {
    if (!this.selectedShape) return;

    this.drawer.ctx.save();
    this.drawer.ctx.strokeStyle = '#007bff';
    this.drawer.ctx.lineWidth = 2;
    this.drawer.ctx.setLineDash([5, 5]);
    
    switch (this.selectedShape.type) {
      case 'rectangle':
        const rect = this.selectedShape.data;
        this.drawer.ctx.strokeRect(
          rect.x - 3, 
          rect.y - 3, 
          rect.width + 6, 
          rect.height + 6
        );
        break;
      case 'circle':
        const circle = this.selectedShape.data;
        this.drawer.ctx.beginPath();
        this.drawer.ctx.arc(
          circle.x, 
          circle.y, 
          circle.radius + 3, 
          0, 
          Math.PI * 2
        );
        this.drawer.ctx.stroke();
        break;
      case 'polygon':
        const polygon = this.selectedShape.data;
        if (polygon.points.length >= 3) {
          this.drawer.ctx.beginPath();
          this.drawer.ctx.moveTo(polygon.points[0].x, polygon.points[0].y);
          for (let i = 1; i < polygon.points.length; i++) {
            this.drawer.ctx.lineTo(polygon.points[i].x, polygon.points[i].y);
          }
          this.drawer.ctx.closePath();
          this.drawer.ctx.stroke();
        }
        break;
    }
    
    this.drawer.ctx.restore();
  }

  _clearSelection() {
    if (this.selectedShape) {
      this.drawer.eventManager.emit('shapeDeselected', { 
        shape: this.selectedShape 
      });
    }
    
    this.selectedShape = null;
    this._redrawCanvas();
  }

  _redrawCanvas() {
    this.drawer.ctx.clearRect(0, 0, this.drawer.canvas.width, this.drawer.canvas.height);
    this.drawer.getShapes().forEach(shape => {
      shape.draw(this.drawer.ctx);
    });
  }

  _unbindEvents() {
    this._clearSelection();
    this.isDragging = false;
    this.dragStartPoint = null;
    this.originalShapePosition = null;
    this.drawer.resetEvent();
  }
}
