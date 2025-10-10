import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgrPlugin from "vite-plugin-svgr";
// import eslint from 'vite-plugin-eslint';

import { readFileSync } from 'fs'
import { resolve } from 'path'

// Read package.json
const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, 'package.json'), 'utf-8')
)

export default defineConfig({
  plugins: [
    react(),
    svgrPlugin({
      svgrOptions: {
        ref: true,
      },
    })
  ],
  define: {
    // Make version available as a global constant
    __APP_NAME__: JSON.stringify(packageJson.name),
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __APP_LICENSE__: JSON.stringify(packageJson.license),
    __APP_AUTHOR__: JSON.stringify(packageJson.author),
    __APP_DESCRIPTION__: JSON.stringify(packageJson.description),
    __APP_URL__: JSON.stringify(packageJson.url) || `"#"`
  },
  server: {
    open: false, // automatically open the app in the browser
    port: 3000,
  },
  resolve: {
    alias: {
      screens: path.resolve(__dirname, './src/screens'),
      stream: 'stream-browserify',
      assert: 'assert',
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['fs'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          plot: ['plotly.js', 'plotly-icons','react-plotly.js']
        },
        globals: {
          fs: 'empty'
        }
      },
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
});