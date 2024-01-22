import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react'; // you can also use @vitejs/plugin-react-swc
import pages, { DefaultPageStrategy } from 'vite-plugin-react-pages';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    pages({
      pagesDir: path.join(__dirname, 'pages'),
      pageStrategy: new DefaultPageStrategy({
        extraFindPages: async (pagesDir, helpers) => {
          const srcPath = path.join(__dirname, '/pages');
          // eslint-disable-next-line no-undef
          if (String(process.env.SHOW_ALL_COMPONENT_DEMOS) === 'true') {
            // show all component demos during dev
            helpers.watchFiles(srcPath, `${srcPath}/demos/**/*.{jsx,md?(x)}`, async function fileHandler(file, api) {
              const { relative, path: absolute } = file;
              const match = relative.match(/demos\/(.*)\.([tj]sx|mdx?)$/);
              if (!match) throw new Error('unexpected file: ' + absolute);
              const [key, componentName] = match;
              const pageId = `/demos/${componentName}`;
              // register page data
              api.addPageData({
                pageId,
                key,
                // register demo runtime data path
                // the ?demo query will wrap the module with useful demoInfo
                // that will be consumed by theme-doc
                dataPath: `${absolute}?demo`,
                // register demo static data
                staticData: await helpers.extractStaticData(file),
              });
            });
          }

          // find all component README
          helpers.watchFiles(srcPath, '*/README.md?(x)', async function fileHandler(file, api) {
            const { relative, path: absolute } = file;
            const match = relative.match(/(.*)\/README\.mdx?$/);
            if (!match) throw new Error('unexpected file: ' + absolute);
            const [_, componentName] = match;
            const pageId = `/pages/${componentName}`;
            // register page data
            api.addPageData({
              pageId,
              // register demo runtime data path
              dataPath: absolute,
              // register demo static data
              staticData: await helpers.extractStaticData(file),
            });
          });
        },
      }),
    }),
  ],
  resolve: {
    alias: {
      'react-calendar-timeline-v2': path.join(__dirname, '../src'),
    },
  },
});
