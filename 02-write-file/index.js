const fs = require('node:fs');
const process = require('node:process');
const path = require('node:path');

let textPath = path.join(__dirname, 'text.txt');
const inputFile = fs.createWriteStream(textPath, { flags: 'a' });

let readline = require('readline');
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log('Hello! Write a text');

rl.on('line', (input) => {
    if (input === 'exit') {
        rl.close();
        return;
    }

    inputFile.write(`${input}\n`, (err) => {
        if (err) {
            console.log("It's an error");
        } else {
            console.log('Text is written. Write something else. To exit type "exit" or press Ctrl+C.');
        }
    });
});

process.on('SIGINT', () => {
    rl.close();
});

rl.on('close', () => {
    inputFile.end(() => {
        console.log("It's over");
        process.exit();
    });
});
