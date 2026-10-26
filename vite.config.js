import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/contact.php': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: () => `/skillup/contact.php`,
      },
    },
  },
})
