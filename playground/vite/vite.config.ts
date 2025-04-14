import SRI from 'unplugin-sri-inject/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    Inspect(),
    SRI(),
  ],
})
