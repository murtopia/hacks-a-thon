import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        vote: resolve(__dirname, 'vote.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
})
