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

const rawBase = process.env.VITE_BASE || '/';
const base = rawBase === '/' ? '/' : `/${rawBase.replace(/^\/+|\/+$/g, '')}/`;

function prefixRootUrls(html, basePath) {
  if (basePath === '/') return html;
  const escapedBase = basePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const alreadyPrefixed = new RegExp(`^${escapedBase}`);

  const rewritePath = (path) => {
    if (path.startsWith('//') || alreadyPrefixed.test(path)) return path;
    return `${basePath}${path.slice(1)}`;
  };

  return html
    .replace(
      /\b(href|src|poster)=(["'])(\/(?!\/)[^"']*)\2/g,
      (_match, attr, quote, path) => `${attr}=${quote}${rewritePath(path)}${quote}`
    )
    .replace(
      /url\((['"]?)(\/(?!\/)[^)'"]*)\1\)/g,
      (_match, quote, path) => `url(${quote}${rewritePath(path)}${quote})`
    );
}

export default defineConfig({
  base,
  plugins: [
    tailwindcss(),
    {
      name: 'multi-page-routing',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          return prefixRootUrls(html, base);
        }
      },
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
