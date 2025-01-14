import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base:"weather-app",
  plugins: [react()],
  server: {
    proxy: {
      '/linked/graphql': {
        target: 'https://opendata.cwa.gov.tw',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/graphql/, '/linked/graphql'),
      },
    },
  },
})
