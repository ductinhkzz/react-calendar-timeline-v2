import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ViteCSSExportPlugin from 'vite-plugin-css-export'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
    }),
    ViteCSSExportPlugin(),
  ],
  resolve: {
    alias: {
      'react-calendar-timeline-v2': './src/index.js',
    },
  },
  build: {
    lib: {
      entry: './src/index.js',
      name: 'ReactCalendarTimelineV2',
      fileName: 'react-calendar-timeline-v2',
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
});
