import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import * as path from 'path';

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react(), tailwindcss()],
  build: { manifest: true },
  server: command === 'serve' && !isPreview ? {
    proxy: {
      '/api': 'http://127.0.0.1:8080',
    },
  } : undefined,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
}))
