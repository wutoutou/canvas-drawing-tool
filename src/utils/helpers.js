/**
 * 通用工具函数
 */

/**
 * 生成唯一ID
 */
export function generateId(prefix = '') {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 防抖函数
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

/**
 * 节流函数
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 深拷贝对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * 合并多个对象
 */
export function mergeObjects(...objects) {
  return objects.reduce((result, obj) => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (obj[key] !== undefined) {
          if (typeof obj[key] === 'object' && obj[key] !== null && 
              typeof result[key] === 'object' && result[key] !== null) {
            result[key] = mergeObjects(result[key], obj[key]);
          } else {
            result[key] = deepClone(obj[key]);
          }
        }
      });
    }
    return result;
  }, {});
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 颜色转换：RGB 转 HEX
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * 颜色转换：HEX 转 RGB
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * 获取鼠标位置相对于元素的坐标
 */
export function getRelativeMousePosition(event, element) {
  const rect = element.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

/**
 * 限制数值在最小最大值之间
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * 线性插值
 */
export function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/**
 * 判断点是否在矩形内
 */
export function isPointInRect(point, rect, tolerance = 0) {
  return point.x >= rect.x - tolerance && 
         point.x <= rect.x + rect.width + tolerance && 
         point.y >= rect.y - tolerance && 
         point.y <= rect.y + rect.height + tolerance;
}

/**
 * 判断点是否在圆形内
 */
export function isPointInCircle(point, circle, tolerance = 0) {
  const distance = Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2);
  return distance <= circle.radius + tolerance;
}
