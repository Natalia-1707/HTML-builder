const fs = require('fs');
const path = require('node:path');
let textPath = path.join(__dirname, 'text.txt');
console.log(textPath);
const readStream = fs.createReadStream(textPath);
readStream.on('data', function(chunk) {
    process.stdout.write(chunk);
})
