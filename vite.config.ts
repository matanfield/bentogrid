import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // For dev mode, serve the demo
  // For build, uncomment the lib config below
  // build: {
  //   lib: {
  //     entry: './src/index.ts',
  //     name: 'BentoGrid',
  //     fileName: 'index',
  //     formats: ['es', 'cjs']
  //   },
  //   rollupOptions: {
  //     external: ['react', 'react-dom'],
  //     output: {
  //       globals: {
  //         react: 'React',
  //         'react-dom': 'ReactDOM'
  //       }
  //     }
  //   }
  // }
})

