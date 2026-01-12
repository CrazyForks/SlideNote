import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/sidepanel/index.html'),
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.includes('icon')) {
            return 'icons/[name].[ext]';
          }
          return '[name].[ext]';
        },
      },
    },
  },
  // 开发服务器
  server: {
    port: 3000,
    open: '/src/sidepanel/index.html',
  },
});
