const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');

for (let i = 0; i < 100; ++i) {
    fs.appendFileSync('data.txt', '\nLine ' + i + '\n');
}

console.log(data);
