import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 10000;

// Auto-build dist if it doesn't exist yet on startup
const indexHtmlPath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  console.log('📦 dist/index.html missing. Auto-building project with npm run build...');
  try {
    execSync('npm run build', { cwd: __dirname, stdio: 'inherit' });
  } catch (err) {
    console.error('Build failed:', err);
  }
}

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

  // Safety fallback if dist/index.html is still missing
  if (!fs.existsSync(filePath)) {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>500 - Building Application... Please refresh in 5 seconds.</h1>');
    return;
  }

  const fileExt = path.extname(filePath);
  const contentType = MIME_TYPES[fileExt] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Server Error: ${err.code}`);
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
