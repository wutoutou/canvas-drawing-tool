export default class Shape {
  constructor(id, type, data) {
    this.id = id;
    this.type = type;
    this.data = data;
  }

  draw(ctx) {
    // 子类实现具体绘制逻辑
  }

  containsPoint(point) {
    // 子类实现点击检测逻辑
    return false;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      data: { ...this.data }
    };
  }

  static fromJSON(json) {
    return new Shape(json.id, json.type, json.data);
  }
}
