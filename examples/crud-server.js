const http = require('node:http');

function handler(req, res) {
    console.log('Request received', req.url, req.method);

    switch(req.url) {
        case '/categories':
            if(req.method === 'GET') {
                res.end('Category read');
            } else if(req.method === 'POST') {
                res.end('Category created');
            } else if (req.method === 'PATCH') {
                res.end('Category updated');
            } else if (req.method === 'DELETE') {
                res.end('Category deleted');
            }
             else {
                res.statusCode = 405;
                res.end('Method not allowed');
            }
            break;
        default:
            res.statusCode = 404;
            res.end('Not found');
            break;
    }
}

const server = http.createServer(handler);

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});