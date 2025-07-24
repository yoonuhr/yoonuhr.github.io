const http = require('http');

// Test the health endpoint
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Health check response:', JSON.parse(data));
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('Request failed:', e.message);
  process.exit(1);
});
