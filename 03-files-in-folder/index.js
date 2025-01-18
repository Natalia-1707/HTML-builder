const fs = require('node:fs');
const path = require('node:path');


async function filesInfo () {
    const folderPath = path.join(__dirname, 'secret-folder');
    try {
        const files = await fs.promises.readdir(folderPath, { withFileTypes: true });
        let fileInfo;
        for (const file of files) {
            if (file.isFile()) {
                const filePath = path.join(folderPath, file.name);
                const stats = await fs.promises.stat(filePath);
                const fileSize = (stats.size / 1024).toFixed(3);
                const extension = path.extname(file.name).slice(1);
                const fileName = path.basename(file.name).slice(0, file.name.lastIndexOf('.'));

                fileInfo = `${fileName} - ${extension} - ${fileSize}kb`
                console.log(fileInfo);
            }
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

filesInfo();
