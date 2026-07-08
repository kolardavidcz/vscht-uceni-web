const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Allow-Headers': '*'
  });
  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    console.log("### FRONTEND ERROR ###");
    console.log(body);
    console.log("######################");
    res.end('ok');
    process.exit(0);
  });
}).listen(9999);
console.log("Listening on 9999...");
