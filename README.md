## 🚀 使用示例

### 1. 在 HTML 中使用
``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="drawing-container" style="width: 800px; height: 600px;"></div>
    
    <script src="./dist/canvas-drawing-tool.umd.js"></script>
    <script>
        const drawingBoard = CanvasDrawingTool.createDrawingBoard('drawing-container', {
            width: 800,
            height: 500
        });
        
        // 添加事件监听
        drawingBoard.onStartDrawing = (x, y) => {
            console.log('开始绘制:', x, y);
        };
    </script>
</body>
</html>
```

### 2. 在 模块中使用

``` javascript
import { createDrawingBoard } from 'canvas-drawing-tool';

const drawingBoard = createDrawingBoard('container', {
    width: 1000,
    height: 600,
    backgroundColor: '#f0f0f0'
});

// 保存图片
document.getElementById('save-btn').addEventListener('click', () => {
    drawingBoard.saveImage('my-drawing.png');
});
```
