import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/linked/graphql': {
        target: 'https://opendata.cwa.gov.tw',
        changeOrigin: true,
      },
    },
  },
})
