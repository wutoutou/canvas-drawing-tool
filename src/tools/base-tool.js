import { generateId } from '../utils/index';
export default class BaseTool {
  constructor(drawer) {
    this.drawer = drawer;
    this.name = 'base';
    this.isDrawing = false;
    this.currentShape = null;
  }

  activate() {
    this._bindEvents();
  }

  deactivate() {
    this._unbindEvents();
  }

  _bindEvents() {
    this.drawer.on('mousedown', this._onMouseDown.bind(this));
    this.drawer.on('mousemove', this._onMouseMove.bind(this));
    this.drawer.on('mouseup', this._onMouseUp.bind(this));
    this.drawer.on('dblclick', this._onDoubleClick.bind(this));
  }

  _unbindEvents() {
    // 在具体工具类中实现
  }

  _onMouseDown({ point, event }) {}
  _onMouseMove({ point, event }) {}
  _onMouseUp({ point, event }) {}
  _onDoubleClick({ point, event }) {}

  _createShape(type, data) {
    return {
      id: generateId(type),
      type,
      data: {
        ...data,
        color: this.drawer.currentColor,
        lineWidth: this.drawer.currentLineWidth,
        createdAt: new Date().toISOString()
      }
    };
  }
}
