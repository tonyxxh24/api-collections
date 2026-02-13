const http = require('node:http');
const { URL } = require('node:url');
const { loadApis, filterApis } = require('./apis');

const PORT = process.env.PORT || 3000;

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function requestHandler(req, res) {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && reqUrl.pathname === '/apis') {
    const filters = {
      country: reqUrl.searchParams.get('country') || '',
      pricing: reqUrl.searchParams.get('pricing') || '',
      category: reqUrl.searchParams.get('category') || '',
      q: reqUrl.searchParams.get('q') || ''
    };

    const apis = loadApis();
    const results = filterApis(apis, filters);

    return sendJson(res, 200, {
      total: results.length,
      filters,
      data: results
    });
  }

  return sendJson(res, 404, { message: 'Not Found' });
}

if (require.main === module) {
  const server = http.createServer(requestHandler);
  server.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
  });
}

module.exports = {
  requestHandler
};
