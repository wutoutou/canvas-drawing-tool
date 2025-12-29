/**
 * 工具函数模块
 */

/**
 * 获取鼠标/触摸在画布上的坐标
 * @param {HTMLCanvasElement} canvas - 画布元素
 * @param {Event} e - 事件对象
 * @returns {Object} 坐标对象 {x, y}
 */
export const getCanvasPosition = (canvas, e) => {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if (e.type.includes('touch')) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
};

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间
 * @returns {Function} 防抖后的函数
 */
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

/**
 * 生成随机颜色
 * @returns {string} 十六进制颜色值
 */
export const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

/**
 * 下载数据URL为文件
 * @param {string} dataUrl - 数据URL
 * @param {string} filename - 文件名
 */
export const downloadDataUrl = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
};

/**
 * 创建DOM元素
 * @param {string} tag - 标签名
 * @param {Object} options - 选项
 * @returns {HTMLElement} DOM元素
 */
export const createElement = (tag, options = {}) => {
    const element = document.createElement(tag);
    
    if (options.className) {
        element.className = options.className;
    }
    
    if (options.innerHTML) {
        element.innerHTML = options.innerHTML;
    }
    
    if (options.attrs) {
        Object.keys(options.attrs).forEach(key => {
            element.setAttribute(key, options.attrs[key]);
        });
    }
    
    if (options.style) {
        Object.assign(element.style, options.style);
    }
    
    return element;
};
