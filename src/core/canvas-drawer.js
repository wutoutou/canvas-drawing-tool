import EventManager from "./event-manager.js";
import { ShapeFactory } from "../shapes";

export default class CanvasDrawer {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.canvas = null;
    this.ctx = null;
    this.shapes = new Map();
    this.eventManager = new EventManager();
    this.isDrawing = false;

    this._initializeCanvas();
    this._bindEvents();
  }

  _initializeCanvas() {
    // 创建 canvas 元素
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
    this.canvas.style.backgroundColor = this.config.backgroundColor;
    this.canvas.style.cursor = "crosshair";

    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    // 设置默认样式
    this.currentColor = this.config.defaultColor;
    this.currentLineWidth = this.config.defaultLineWidth;
  }

  _bindEvents() {
    this.canvas.addEventListener("mousedown", this._handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this._handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this._handleMouseUp.bind(this));
    this.canvas.addEventListener(
      "dblclick",
      this._handleDoubleClick.bind(this)
    );
  }

  _handleMouseDown(event) {
    const point = this._getMousePosition(event);
    this.eventManager.emit("mousedown", { point, event });
  }

  _handleMouseMove(event) {
    const point = this._getMousePosition(event);
    this.eventManager.emit("mousemove", { point, event });
  }

  _handleMouseUp(event) {
    const point = this._getMousePosition(event);
    this.eventManager.emit("mouseup", { point, event });
  }

  _handleDoubleClick(event) {
    const point = this._getMousePosition(event);
    this.eventManager.emit("dblclick", { point, event });
  }

  _getMousePosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  setColor(color) {
    this.currentColor = color;
    this.ctx.strokeStyle = color;
  }

  setLineWidth(width) {
    this.currentLineWidth = width;
    this.ctx.lineWidth = width;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.shapes.clear();
    this.eventManager.clear();
    this.eventManager.emit("clear");
  }

  addShape(shapeData) {
    const shape = ShapeFactory.createShape(shapeData);
    if (shape) {
      this.shapes.set(shape.id, shape);
      this._redraw();
      this.eventManager.emit("shapeAdded", { shape });
    }
  }

  removeShape(shapeId) {
    if (this.shapes.has(shapeId)) {
      const shape = this.shapes.get(shapeId);
      this.shapes.delete(shapeId);
      this._redraw();
      this.eventManager.emit("shapeRemoved", { shape });
    }
  }

  getShapes() {
    return Array.from(this.shapes.values());
  }

  getShape(shapeId) {
    return this.shapes.get(shapeId);
  }

  _redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制所有图形
    this.shapes.forEach((shape) => {
      shape.draw(this.ctx);
    });
  }

  exportImage(format = "image/png", quality = 1.0) {
    return this.canvas.toDataURL(format, quality);
  }

  importData(shapesData) {
    this.clear();
    shapesData.forEach((shapeData) => {
      this.addShape(shapeData);
    });
  }

  exportData() {
    return this.getShapes().map((shape) => shape.toJSON());
  }

  on(event, callback) {
    this.eventManager.on(event, callback);
  }

  off(event, callback) {
    this.eventManager.off(event, callback);
  }

  resetEvent() {
    this.eventManager.clear();
  }

  destroy() {
    this.canvas.remove();
    this.eventManager.clear();
  }

  /**
   * 设置画布尺寸
   */
  setSize(width, height) {
    // 保存当前内容
    const currentImage = this.getDataUrl();

    // 调整画布尺寸
    this.canvas.width = width;
    this.canvas.height = height;

    // 重新绘制内容
    const img = new Image();
    img.onload = () => {
      this.ctx.fillStyle = this.config.backgroundColor;
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.drawImage(img, 0, 0);
    };
    img.src = currentImage;
  }

  /**
   * 设置背景颜色
   */
  setBackgroundColor(color) {
    this.config.backgroundColor = color;
    const currentImage = this.getDataUrl();

    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const img = new Image();
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0);
    };
    img.src = currentImage;
  }

  /**
   * 获取画布数据URL
   */
  getDataUrl(type = "image/png", quality = 1) {
    return this.canvas.toDataURL(type, quality);
  }
}
