import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 新增引入path模块

export default defineConfig({
  plugins: [vue()],
  // 保留您原有的server配置
  server: {
    port: 3000,
    open: true
  },
  // 新增以下配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.jpeg']
})