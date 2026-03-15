const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const http = require('http');
const { handler } = require('./recipe.js');
const { handler: healthHandler } = require('./health.js');

const PORT = 9999;

http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204); res.end(); return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    try {
      const result = await healthHandler({}, {});
      res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
      res.end(result.body);
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }
    return;
  }

  if (req.method === 'POST' && req.url === '/recipe') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const result = await handler(
          { httpMethod: 'POST', body },
          {}
        );
        res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
        res.end(result.body);
      } catch (e) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  } else {
    res.writeHead(404); res.end();
  }
}).listen(PORT, () => {
  console.log(`✓ Local function server running on http://localhost:${PORT}`);
});
