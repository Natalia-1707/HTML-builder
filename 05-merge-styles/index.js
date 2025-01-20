const fs = require('node:fs');
const path = require('node:path');

const folderPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function cssBundle() {
    try {
        await fs.promises.writeFile(bundlePath, '', 'utf-8');
        const files = await fs.promises.readdir(folderPath, { withFileTypes: true });
        for (const file of files) {
            if (file.isFile() && path.extname(file.name) === '.css') {
                const filePath = path.join(folderPath, file.name);
                    const data = await fs.promises.readFile(filePath, 'utf-8');
                    await fs.promises.appendFile(bundlePath, data + '\n', 'utf-8');
            }
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

cssBundle();