const fs = require('node:fs');
const path = require('node:path');

const folderPath = path.join(__dirname, 'files');
const folderCopy = path.join(__dirname, 'files-copy');

async function createFolder() {
    try {
        await fs.promises.mkdir(folderCopy, { recursive: true });
    } catch (err) {
        console.error(err);
    }
}

async function copyFile(folder, copyFolder) {
    try {
        await fs.promises.copyFile(folder, copyFolder);
    } catch (err) {
        console.error(err);
    }
}

async function copyDir() {
    try {
        await createFolder();
        const files = await fs.promises.readdir(folderPath, { withFileTypes: true });
        for (let file of files) {
            const filePath = path.join(folderPath, file.name);
            const copyFilePath = path.join(folderCopy, file.name);
            if (file.isFile()) {
                await copyFile(filePath, copyFilePath);
            } else if (file.isDirectory()) {
                await recursiveCopyDir(filePath, copyFilePath);
            }
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

async function recursiveCopyDir(src, copy) {
    try {
        await fs.promises.mkdir(copy, { recursive: true });

        const files = await fs.promises.readdir(src, { withFileTypes: true });

        for (const file of files) {
            const srcFilePath = path.join(src, file.name);
            const copyFilePath = path.join(copy, file.name);

            if (file.isFile()) {
                await copyFile(srcFilePath, copyFilePath);
            } else if (file.isDirectory()) {
                await recursiveCopyDir(srcFilePath, copyFilePath);
            }
        }
    } catch (err) {
        console.error('Ошибка в recursiveCopyDir:', err);
    }
}


copyDir();