import { nodeResolve } from '@rollup/plugin-node-resolve'; // 找到文件位置
import commonjs from '@rollup/plugin-commonjs'; // 将commonjs 模块转换为ES Module 格式
import { terser } from 'rollup-plugin-terser'; // 代码压缩和混淆

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/canvas-drawing-tool.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/canvas-drawing-tool.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/canvas-drawing-tool.umd.js',
      format: 'umd',
      name: 'CanvasDrawingTool',
      sourcemap: true
    }
  ],
  plugins: [
    nodeResolve({
      browser: true
    }),
    commonjs(),
    terser()
  ]
};
