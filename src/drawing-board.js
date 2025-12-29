import { EventHandler } from './event-handler.js';
import { ToolManager } from './tool-manager.js';
import { downloadDataUrl } from './utils.js';

/**
 * 画板核心类
 */
export class DrawingBoard {
    constructor(containerId, options = {}) {
        this.container = typeof containerId === 'string' 
            ? document.getElementById(containerId) 
            : containerId;
        
        if (!this.container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }
        
        this.options = {
            width: options.width || 800,
            height: options.height || 500,
            backgroundColor: options.backgroundColor || '#ffffff',
            showToolbar: options.showToolbar !== false,
            ...options
        };
        
        this.currentTool = null;
        this.isDestroyed = false;
        
        this.init();
    }
    
    /**
     * 初始化画板
     */
    init() {
        this.createCanvas();
        this.initCanvas();
        
        if (this.options.showToolbar) {
            this.toolManager = new ToolManager(this, this.container);
        }
        
        this.eventHandler = new EventHandler(this.canvas, this);
        this.bindKeyboardEvents();
    }
    
    /**
     * 创建画布元素
     */
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.canvas.className = 'canvas-drawing-canvas';
        this.canvas.style.cursor = 'crosshair';
        
        // 清空容器并添加画布
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
    }
    
    /**
     * 初始化画布设置
     */
    initCanvas() {
        // 设置画布背景
        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 设置线条样式
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        
        // 设置默认工具
        this.setTool({
            color: '#e74c3c',
            size: 5
        });
    }
    
    /**
     * 设置当前工具
     */
    setTool(toolConfig) {
        this.currentTool = toolConfig;
    }
    
    /**
     * 绘制线条
     */
    drawLine(startX, startY, endX, endY) {
        if (this.isDestroyed) return;
        
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        
        this.ctx.strokeStyle = this.currentTool.color;
        this.ctx.lineWidth = this.currentTool.size;
        this.ctx.stroke();
    }
    
    /**
     * 清空画布
     */
    clearCanvas() {
        if (this.isDestroyed) return;
        
        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * 保存图片
     */
    saveImage(filename = `drawing-${new Date().getTime()}.png`) {
        if (this.isDestroyed) return;
        
        const dataUrl = this.canvas.toDataURL('image/png');
        downloadDataUrl(dataUrl, filename);
    }
    
    /**
     * 获取画布数据URL
     */
    getDataUrl(type = 'image/png', quality = 1) {
        if (this.isDestroyed) return '';
        return this.canvas.toDataURL(type, quality);
    }
    
    /**
     * 设置画布尺寸
     */
    setSize(width, height) {
        if (this.isDestroyed) return;
        
        // 保存当前内容
        const currentImage = this.getDataUrl();
        
        // 调整画布尺寸
        this.canvas.width = width;
        this.canvas.height = height;
        
        // 重新绘制内容
        const img = new Image();
        img.onload = () => {
            this.ctx.fillStyle = this.options.backgroundColor;
            this.ctx.fillRect(0, 0, width, height);
            this.ctx.drawImage(img, 0, 0);
        };
        img.src = currentImage;
    }
    
    /**
     * 设置背景颜色
     */
    setBackgroundColor(color) {
        if (this.isDestroyed) return;
        
        this.options.backgroundColor = color;
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
     * 绑定键盘事件
     */
    bindKeyboardEvents() {
        this.keyboardHandler = (e) => {
            if (this.isDestroyed) return;
            
            if (this.toolManager) {
                // B 键切换画笔
                if (e.key === 'b' || e.key === 'B') {
                    e.preventDefault();
                    this.toolManager.setCurrentTool('brush');
                }
                
                // E 键切换橡皮擦
                if (e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                    this.toolManager.setCurrentTool('eraser');
                }
            }
            
            // Delete 键清空画布
            if (e.key === 'Delete') {
                e.preventDefault();
                this.clearCanvas();
            }
        };
        
        document.addEventListener('keydown', this.keyboardHandler);
    }
    
    /**
     * 事件回调
     */
    onStartDrawing(x, y) {
        // 可由外部重写
    }
    
    onDrawing(x, y) {
        // 可由外部重写
    }
    
    onStopDrawing() {
        // 可由外部重写
    }
    
    /**
     * 销毁画板，清理资源
     */
    destroy() {
        if (this.isDestroyed) return;
        
        this.isDestroyed = true;
        
        if (this.eventHandler) {
            this.eventHandler.destroy();
        }
        
        if (this.toolManager) {
            this.toolManager.destroy();
        }
        
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }
        
        this.container.innerHTML = '';
    }
}
