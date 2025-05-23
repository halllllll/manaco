import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import * as glob from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import tsconfigPaths from 'vite-tsconfig-paths';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// const entries = glob.sync(path.resolve(__dirname, './src', '**', '*.html'));
const entries = glob.sync(path.resolve(__dirname, 'src', '**', '*.html'));

console.log('👺');
console.log('entries', entries);

for (const entry of entries) {
  const componentName = path.basename(path.dirname(entry));
  console.log('entry', componentName);
  await build({
    // root: path.resolve(__dirname, './src'),
    plugins: [react(), tsconfigPaths(), viteSingleFile(), tailwindcss()],
    build: {
      outDir: './dist', // build to dist directory at root (omitting the src dir)
      assetsDir: componentName,
      rollupOptions: {
        input: path.resolve(__dirname, `./src/${componentName}/index.html`),
        output: {
          // entryFileNames: `${componentName}/element.js`,
          entryFileNames: '[name].js',
          // This prevents nested folder structures in output
          // preserveModules: false,
        },
      },
    },
  });
}
