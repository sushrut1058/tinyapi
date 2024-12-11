import { defineConfig } from 'vite'
import {resolve, join} from 'path'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "tailwindcss";


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
      '@/lib': resolve(__dirname, 'src/lib'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  }
})
