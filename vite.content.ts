import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import babel from '@rollup/plugin-babel'
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
    root: 'src',
    plugins: [
        react(),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
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
                'content-script': 'src/extend/content-script.js'
            },
            output: {
                entryFileNames: '[name].js',
                assetFileNames: 'content.[ext]'
            }
        }
    }
})
