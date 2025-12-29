import { getCanvasPosition } from './utils.js';

/**
 * 事件处理器类
 */
export class EventHandler {
    constructor(canvas, drawingBoard) {
        this.canvas = canvas;
        this.drawingBoard = drawingBoard;
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        
        this.bindEvents();
    }
    
    /**
     * 绑定所有事件
     */
    bindEvents() {
        // 鼠标事件
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseout', this.handleMouseUp.bind(this));
        
        // 触摸事件
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // 阻止触摸事件的默认行为
        this.canvas.addEventListener('touchstart', this.preventDefaultTouch);
        this.canvas.addEventListener('touchmove', this.preventDefaultTouch);
    }
    
    handleMouseDown(e) {
        this.startDrawing(e);
    }
    
    handleMouseMove(e) {
        this.draw(e);
    }
    
    handleMouseUp() {
        this.stopDrawing();
    }
    
    handleTouchStart(e) {
        this.startDrawing(e);
    }
    
    handleTouchMove(e) {
        this.draw(e);
    }
    
    handleTouchEnd() {
        this.stopDrawing();
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        const pos = getCanvasPosition(this.canvas, e);
        [this.lastX, this.lastY] = [pos.x, pos.y];
        
        if (this.drawingBoard.onStartDrawing) {
            this.drawingBoard.onStartDrawing(pos.x, pos.y);
        }
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        e.preventDefault();
        const pos = getCanvasPosition(this.canvas, e);
        
        this.drawingBoard.drawLine(this.lastX, this.lastY, pos.x, pos.y);
        [this.lastX, this.lastY] = [pos.x, pos.y];
        
        if (this.drawingBoard.onDrawing) {
            this.drawingBoard.onDrawing(pos.x, pos.y);
        }
    }
    
    stopDrawing() {
        this.isDrawing = false;
        if (this.drawingBoard.onStopDrawing) {
            this.drawingBoard.onStopDrawing();
        }
    }
    
    preventDefaultTouch(e) {
        e.preventDefault();
    }
    
    /**
     * 销毁事件处理器
     */
    destroy() {
        // 移除所有事件监听器
        this.canvas.replaceWith(this.canvas.cloneNode(true));
    }
}
