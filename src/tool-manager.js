/**
 * 工具管理器类
 */
export class ToolManager {
    constructor(drawingBoard, container) {
        this.drawingBoard = drawingBoard;
        this.container = container;
        this.currentTool = 'brush';
        this.toolElements = new Map();
        
        this.initTools();
        this.createToolbar();
        this.bindToolEvents();
    }
    
    /**
     * 初始化工具配置
     */
    initTools() {
        this.tools = {
            brush: {
                name: '画笔',
                color: '#e74c3c',
                size: 5,
                cursor: 'crosshair'
            },
            eraser: {
                name: '橡皮擦',
                color: 'white',
                size: 20,
                cursor: 'crosshair'
            }
        };
    }
    
    /**
     * 创建工具栏
     */
    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'canvas-drawing-toolbar';
        toolbar.innerHTML = `
            <button class="canvas-tool-btn active" data-tool="brush">画笔</button>
            <button class="canvas-tool-btn" data-tool="eraser">橡皮擦</button>
            <input type="color" class="canvas-color-picker" value="#e74c3c">
            <div class="canvas-brush-size">
                <span>粗细:</span>
                <input type="range" class="canvas-size-slider" min="1" max="50" value="5">
                <span class="canvas-size-value">5px</span>
            </div>
            <button class="canvas-tool-btn" id="canvas-clear-btn">清空</button>
            <button class="canvas-tool-btn" id="canvas-save-btn">保存</button>
        `;
        
        this.container.insertBefore(toolbar, this.container.firstChild);
        
        // 缓存工具元素
        this.toolElements.set('brush', toolbar.querySelector('[data-tool="brush"]'));
        this.toolElements.set('eraser', toolbar.querySelector('[data-tool="eraser"]'));
        this.colorPicker = toolbar.querySelector('.canvas-color-picker');
        this.sizeSlider = toolbar.querySelector('.canvas-size-slider');
        this.sizeValue = toolbar.querySelector('.canvas-size-value');
    }
    
    /**
     * 绑定工具事件
     */
    bindToolEvents() {
        // 工具按钮点击事件
        this.toolElements.forEach((element, toolName) => {
            element.addEventListener('click', () => {
                this.setCurrentTool(toolName);
            });
        });
        
        // 颜色选择器
        this.colorPicker.addEventListener('input', (e) => {
            this.tools.brush.color = e.target.value;
            if (this.currentTool === 'brush') {
                this.drawingBoard.setTool(this.tools.brush);
            }
        });
        
        // 画笔大小调节
        this.sizeSlider.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            this.tools.brush.size = size;
            this.sizeValue.textContent = size + 'px';
            
            if (this.currentTool === 'brush') {
                this.drawingBoard.setTool(this.tools.brush);
            }
        });
        
        // 清空按钮
        this.container.querySelector('#canvas-clear-btn').addEventListener('click', () => {
            this.drawingBoard.clearCanvas();
        });
        
        // 保存按钮
        this.container.querySelector('#canvas-save-btn').addEventListener('click', () => {
            this.drawingBoard.saveImage();
        });
    }
    
    /**
     * 设置当前工具
     */
    setCurrentTool(toolName) {
        if (!this.tools[toolName]) return;
        
        this.currentTool = toolName;
        
        // 更新按钮状态
        this.toolElements.forEach((element, name) => {
            element.classList.toggle('active', name === toolName);
        });
        
        // 更新画板工具设置
        this.drawingBoard.setTool(this.tools[toolName]);
    }
    
    /**
     * 获取当前工具配置
     */
    getCurrentTool() {
        return this.tools[this.currentTool];
    }
    
    /**
     * 销毁工具栏
     */
    destroy() {
        const toolbar = this.container.querySelector('.canvas-drawing-toolbar');
        if (toolbar) {
            toolbar.remove();
        }
    }
}
