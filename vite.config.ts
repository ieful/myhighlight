import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import copy from 'rollup-plugin-copy'


// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  plugins: [
    react(),
    copy({
      targets: [
        // 这里列出你需要拷贝的文件或目录
        { src: 'src/extend/manifest.json', dest: 'dist' },
        { src: 'src/extend/service-worker.js', dest: 'dist' },
        { src: 'src/extend/content-script.js', dest: 'dist' },
        { src: 'src/assets/icon-32.png', dest: 'dist/images' },
        { src: 'src/assets/icon-128.png', dest: 'dist/images' },
      ],
      verbose: true // 是否输出详细信息
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: '../dist', // 指定输出目录
    rollupOptions: {
      input: {
        'popup': '@/pages/popup/index.html',
      }
    }
  }
})
