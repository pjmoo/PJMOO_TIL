const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Mapping file extensions to correct MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // Log request method and URL
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);

  // Route root request to index.html
  let filePath = req.url === '/' ? '/index.html' : req.url;
  
  // Strip out any query strings (e.g. ?heading=heading-1)
  filePath = filePath.split('?')[0];

  // Map to local file system path
  const absolutePath = path.join(__dirname, filePath);

  // Security check: prevent directory traversal attacks
  if (!absolutePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.end('Access Denied');
    return;
  }

  // Check if file exists and is a file
  fs.stat(absolutePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('File Not Found');
      return;
    }

    // Determine content type
    const ext = path.extname(absolutePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    
    // Pipe the file stream to response
    const stream = fs.createReadStream(absolutePath);
    stream.on('error', (streamErr) => {
      console.error('File stream error:', streamErr);
      res.statusCode = 500;
      res.end('Internal Server Error');
    });
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  PJMOO TIL Dev Server is running!`);
  console.log(`  Local URL:  http://localhost:${PORT}`);
  console.log(`==================================================`);
  console.log('Press Ctrl+C to shut down the server.');
});
