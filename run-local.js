require('dotenv').config();
const { handler } = require('./netlify/functions/recipe.js');
const http = require('http');

http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/api/recipe') {
        let body = '';
        req.on('data', d => body += d);
        req.on('end', async () => {
            const result = await handler({ httpMethod: 'POST', body }, {});
            res.writeHead(result.statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(result.body);
        });
    }
}).listen(9999, () => console.log('Function running on 9999'));