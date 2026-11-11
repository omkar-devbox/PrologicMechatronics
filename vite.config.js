import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import fs from 'fs';

const pages = [
  'about-us',
  'solutions',
  'careers',
  'contact-us',
  'news-events'
];

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: 'multi-page-routing',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();
          const cleanUrl = req.url.split('?')[0];

          for (const page of pages) {
            if (
              cleanUrl === `/${page}` ||
              cleanUrl === `/${page}.html` ||
              cleanUrl === `/${page}/`
            ) {
              req.url = `/src/pages/${page}/${page}.html` + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
              break;
            }
            if (cleanUrl === `/${page}.css`) {
              req.url = `/src/pages/${page}/${page}.css` + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
              break;
            }
            if (cleanUrl === `/${page}.ts` || cleanUrl === `/${page}.js`) {
              req.url = `/src/pages/${page}/${page}.ts` + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
              break;
            }
          }
          next();
        });
      },
      closeBundle() {
        // Ensure static HTML files are easily accessible at the root of dist/
        const distDir = resolve(import.meta.dirname, 'dist');
        if (!fs.existsSync(distDir)) return;

        for (const page of pages) {
          const srcHtml = resolve(distDir, `src/pages/${page}/${page}.html`);
          const targetHtml = resolve(distDir, `${page}.html`);
          const targetDir = resolve(distDir, page);

          if (fs.existsSync(srcHtml)) {
            // Copy to dist/<page>.html
            fs.copyFileSync(srcHtml, targetHtml);

            // Also copy to dist/<page>/index.html for directory-style URL resolution
            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }
            fs.copyFileSync(srcHtml, resolve(targetDir, 'index.html'));
          }
        }
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        'about-us': resolve(import.meta.dirname, 'src/pages/about-us/about-us.html'),
        solutions: resolve(import.meta.dirname, 'src/pages/solutions/solutions.html'),
        careers: resolve(import.meta.dirname, 'src/pages/careers/careers.html'),
        'contact-us': resolve(import.meta.dirname, 'src/pages/contact-us/contact-us.html'),
        'news-events': resolve(import.meta.dirname, 'src/pages/news-events/news-events.html'),
      }
    }
  }
});
