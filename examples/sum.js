// Take input a, b from the user
const readline = require('node:readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter a: ', (a) => {
    rl.question('Enter b: ', (b) => {
        console.log(sum(parseInt(a), parseInt(b)));
        rl.close();
    });
});

function sum(a, b) {
    return a + b;
}
