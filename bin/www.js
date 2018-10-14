const http = require('http');
const app = require('../app');
const port = parseInt(process.env.PORT, 10) || 3600;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, process.env.IP);