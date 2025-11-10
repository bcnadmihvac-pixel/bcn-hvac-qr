import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: base must match your repository name on GitHub exactly.
export default defineConfig({
  base: '/bcn-hvac-qr/',
  plugins: [react()],
})