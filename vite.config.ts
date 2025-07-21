import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          'react': 'react',
          'react-dom': 'react-dom',
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('bootstrap') || id.includes('react-bootstrap')) {
                  return 'bootstrap-vendor';
                }
                if (id.includes('react-toastify')) {
                  return 'toastify-vendor';
                }
                if (id.includes('@google/generative-ai')) {
                  return 'gemini-vendor';
                }
                return 'vendor';
              }
            },
          },
        },
      },
      base: '/PromptMatrixV20/',
      optimizeDeps: {
      },
      plugins: [
        react(),
        visualizer({
          filename: './dist/bundle-analyzer.html',
          open: false, // Set to true to open the report automatically
          gzipSize: true,
          brotliSize: true,
        }),
      ],
    };
});
