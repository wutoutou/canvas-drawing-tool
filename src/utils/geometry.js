/**
 * 几何计算工具函数
 */

/**
 * 计算两点之间的距离
 */
export function distance(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 计算点到线段的距离
 */
export function pointToLineDistance(point, lineStart, lineEnd) {
  const A = point.x - lineStart.x;
  const B = point.y - lineStart.y;
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  
  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  } else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  } else {
    xx = lineStart.x + param * C;
    yy = lineStart.y + param * D;
  }

  const dx = point.x - xx;
  const dy = point.y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 判断点是否在多边形内（射线法）
 */
export function isPointInPolygon(point, polygonPoints) {
  if (polygonPoints.length < 3) return false;

  let inside = false;
  for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
    const xi = polygonPoints[i].x, yi = polygonPoints[i].y;
    const xj = polygonPoints[j].x, yj = polygonPoints[j].y;
    
    const intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
}

/**
 * 计算多边形中心点
 */
export function getPolygonCenter(points) {
  if (points.length === 0) return { x: 0, y: 0 };
  
  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  
  return { x: centerX, y: centerY };
}

/**
 * 计算矩形边界框
 */
export function getBoundingBox(points) {
  if (points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
  
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * 判断两个矩形是否相交
 */
export function isRectIntersect(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

/**
 * 计算线段的斜率
 */
export function getSlope(point1, point2) {
  if (point2.x === point1.x) return Infinity; // 垂直线
  return (point2.y - point1.y) / (point2.x - point1.x);
}

/**
 * 计算线段的垂直平分线
 */
export function getPerpendicularBisector(point1, point2) {
  const midPoint = {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
  
  const slope = getSlope(point1, point2);
  const perpendicularSlope = slope === 0 ? Infinity : slope === Infinity ? 0 : -1 / slope;
  
  return {
    point: midPoint,
    slope: perpendicularSlope
  };
}
