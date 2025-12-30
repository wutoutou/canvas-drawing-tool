import Rectangle from './rectangle.js';
import Circle from './circle.js';
import Polygon from './polygon.js';
import Brush from './brush.js';

export class ShapeFactory {
  static createShape(shapeData) {
    const { type, data, id } = shapeData;
    
    switch (type) {
      case 'rectangle':
        return new Rectangle(id, data);
      case 'circle':
        return new Circle(id, data);
      case 'polygon':
        return new Polygon(id, data);
      case 'brush':
        return new Brush(id, data);
      default:
        console.warn(`Unknown shape type: ${type}`);
        return null;
    }
  }

  static createShapeFromJSON(json) {
    return this.createShape(json);
  }
}
