import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/oss-prototype-2/',
  plugins: [react()],
  server: { port: 5173 },
})
