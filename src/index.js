import { DrawingBoard } from './drawing-board.js';

// 默认样式
const defaultStyles = `
.canvas-drawing-toolbar {
    background: #2c3e50;
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
    border-bottom: 1px solid #34495e;
}

.canvas-tool-btn {
    background: #34495e;
    border: none;
    color: white;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    font-size: 14px;
}

.canvas-tool-btn:hover {
    background: #4a6572;
    transform: translateY(-2px);
}

.canvas-tool-btn.active {
    background: #e74c3c;
    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
}

.canvas-color-picker {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    padding: 0;
}

.canvas-brush-size {
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    font-size: 14px;
}

.canvas-size-slider {
    width: 100px;
}

.canvas-drawing-canvas {
    background: white;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    cursor: crosshair;
    display: block;
}
`;

/**
 * 注入默认样式
 */
function injectStyles() {
    if (document.querySelector('#canvas-drawing-tool-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'canvas-drawing-tool-styles';
    style.textContent = defaultStyles;
    document.head.appendChild(style);
}

/**
 * 创建画板实例
 * @param {string|HTMLElement} containerId - 容器ID或元素
 * @param {Object} options - 配置选项
 * @returns {DrawingBoard} 画板实例
 */
export function createDrawingBoard(containerId, options = {}) {
    injectStyles();
    return new DrawingBoard(containerId, options);
}

/**
 * 默认导出
 */
export { DrawingBoard };
