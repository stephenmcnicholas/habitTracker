import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/habittracker/',
  plugins: [react()],
  server: {
    open: '/habittracker/'
  }
})