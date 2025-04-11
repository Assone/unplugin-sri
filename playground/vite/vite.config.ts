import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from '../../packages/sri/src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    Unplugin(),
  ],
})
