import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 10000;

function ensureBuilt() {
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.log('📦 dist/index.html missing. Building project with npm run build...');
    try {
      execSync('npm run build', { cwd: __dirname, stdio: 'inherit' });
    } catch (err) {
      console.error('Build failed:', err);
    }
  }
}

// Check build on startup
ensureBuilt();

const MIME_TYPES = {
  '.html':  'text/html; charset=utf-8',
  '.js':    'text/javascript; charset=utf-8',
  '.css':   'text/css; charset=utf-8',
  '.json':  'application/json; charset=utf-8',
  '.png':   'image/png',
  '.jpg':   'image/jpeg',
  '.svg':   'image/svg+xml',
  '.ico':   'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath);

  const ext = path.extname(filePath);
  if (!ext || !fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  // Safety fallback if dist/index.html is missing
  if (!fs.existsSync(filePath)) {
    ensureBuilt();
  }

  const fileExt = path.extname(filePath);
  const contentType = MIME_TYPES[fileExt] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      const fallbackPath = path.join(DIST_DIR, 'index.html');
      if (filePath !== fallbackPath && fs.existsSync(fallbackPath)) {
        fs.readFile(fallbackPath, (fbErr, fbContent) => {
          if (fbErr) {
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>500 - Server Error</h1>');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fbContent);
          }
        });
        return;
      }
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>500 - Application Initializing... Please refresh in a few seconds.</h1>');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': fileExt === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    });
    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Production server running on http://0.0.0.0:${PORT}`);
});
