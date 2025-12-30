import CanvasDrawer from "./core/canvas-drawer.js";
import {
  BrushTool,
  RectangleTool,
  CircleTool,
  PolygonTool,
  SelectTool,
} from "./tools/index.js";

// 工具类型常量
export const ToolType = {
  BRUSH: "brush",
  RECTANGLE: "rectangle",
  CIRCLE: "circle",
  POLYGON: "polygon",
  SELECT: "select",
};

// 默认配置
export const DefaultConfig = {
  width: 800,
  height: 600,
  backgroundColor: "#ffffff",
  defaultColor: "#000000",
  defaultLineWidth: 2,
};

/**
 * Canvas 绘图工具库
 */
class CanvasDrawingTool {
  constructor(container, config = {}) {
    this.config = { ...DefaultConfig, ...config };
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    if (!this.container) {
      throw new Error(`Container with "${container}" not found`);
    }

    this.drawer = new CanvasDrawer(this.container, this.config);
    this.currentTool = null;
    this.tools = new Map();

    this._initializeTools();
  }

  _initializeTools() {
    // 注册默认工具
    this.registerTool(ToolType.BRUSH, new BrushTool(this.drawer));
    this.registerTool(ToolType.RECTANGLE, new RectangleTool(this.drawer));
    this.registerTool(ToolType.CIRCLE, new CircleTool(this.drawer));
    this.registerTool(ToolType.POLYGON, new PolygonTool(this.drawer));
    this.registerTool(ToolType.SELECT, new SelectTool(this.drawer));

    // 默认使用画笔工具
    this.setTool(ToolType.BRUSH);
  }

  /**
   * 注册工具
   */
  registerTool(name, tool) {
    this.tools.set(name, tool);
    return this;
  }

  /**
   * 设置当前工具
   */
  setTool(toolName) {
    if (this.currentTool) {
      this.currentTool.deactivate();
    }

    const tool = this.tools.get(toolName);
    if (tool) {
      this.currentTool = tool;
      this.currentTool.activate();
    }
    return this;
  }

  /**
   * 设置画笔颜色
   */
  setColor(color) {
    this.drawer.setColor(color);
    return this;
  }

  /**
   * 设置画笔宽度
   */
  setLineWidth(width) {
    this.drawer.setLineWidth(width);
    return this;
  }

  /**
   * 清空画布
   */
  clear() {
    this.drawer.clear();
    return this;
  }

  /**
   * 获取所有图形
   */
  getShapes() {
    return this.drawer.getShapes();
  }

  /**
   * 添加图形
   */
  addShape(shapeData) {
    this.drawer.addShape(shapeData);
    return this;
  }

  /**
   * 删除图形
   */
  removeShape(shapeId) {
    this.drawer.removeShape(shapeId);
    return this;
  }

  /**
   * 导出为图片
   */
  exportImage(format = "image/png", quality = 1.0) {
    return this.drawer.exportImage(format, quality);
  }

  /**
   * 导入图形数据
   */
  importData(shapesData) {
    this.drawer.importData(shapesData);
    return this;
  }

  /**
   * 导出图形数据
   */
  exportData() {
    return this.drawer.exportData();
  }

  /**
   * 销毁实例
   */
  destroy() {
    this.drawer.destroy();
    this.tools.clear();
    this.currentTool = null;
  }

  /**
   * 事件监听
   */
  on(event, callback) {
    this.drawer.on(event, callback);
    return this;
  }

  /**
   * 移除事件监听
   */
  off(event, callback) {
    this.drawer.off(event, callback);
    return this;
  }
}

// 导出主要类和工具
export { CanvasDrawer };
export { BrushTool, RectangleTool, CircleTool, PolygonTool, SelectTool };

export default CanvasDrawingTool;
