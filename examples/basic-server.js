const http = require('node:http');

const server = http.createServer((req, res) => {
    console.log('Request received');

    let data = "";
    // read body of the request

    req.on('data', (chunk) =>{
        data += chunk.toString();
    });

    req.on('end', () => {
        res.end('Input data: ' + data);
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});