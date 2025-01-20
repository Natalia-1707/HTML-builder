const fs = require('node:fs');
const path = require('node:path');



const projectDistPath = path.join(__dirname, 'project-dist');
const templateHTMLPath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const assetsCopyPath = path.join(projectDistPath, 'assets');
const HTMLPath = path.join(projectDistPath, 'index.html');
const CSSPath = path.join(projectDistPath, 'style.css');

async function makeProjectDistFolder() {
    try {
        await fs.promises.mkdir(projectDistPath, { recursive: true });
    } catch (err) {
        console.error('Error buildig a folder project-dist:', err);
    }
}

async function buildHTML() {
    try {
        let templateHTMLData = await fs.promises.readFile(templateHTMLPath, 'utf-8');
        let templateHTMLTags = templateHTMLData.match(/{{\s*[\w]+\s*}}/g);

        for (const tag of templateHTMLTags) {
            const componentName = tag.replace(/{{\s*|\s*}}/g, '');
            const componentPath = path.join(componentsPath, `${componentName}.html`);
            try {
                const componentData = await fs.promises.readFile(componentPath, 'utf-8');
                templateHTMLData = templateHTMLData.replace(tag, componentData);
            } catch (err) {
                console.error('Error reading a component', err);
            }
        }
        await fs.promises.writeFile(HTMLPath, templateHTMLData, 'utf-8');
    } catch (err) {
        console.error('Error buildig HTML:', err);
    }
} 

async function buildCSS() {
    try {
        await fs.promises.writeFile(CSSPath, '', 'utf-8');
        const files = await fs.promises.readdir(stylesPath, { withFileTypes: true });
        for (const file of files) {
            if (file.isFile() && path.extname(file.name) === '.css') {
                const filePath = path.join(stylesPath, file.name);
                const data = await fs.promises.readFile(filePath, 'utf-8');
                await fs.promises.appendFile(CSSPath, data + '\n', 'utf-8');
            }
        }
    } catch (err) {
        console.error('Error buildig CSS:', err);
    }
}

async function createFolder(dest) {
    try {
        await fs.promises.mkdir(dest, { recursive: true });
    } catch (err) {
        console.error('Error making a folder:', err);
    }
}

async function copyFile(src, dest) {
    try {
        await fs.promises.copyFile(src, dest);
    } catch (err) {
        console.error('Error copying files:', err);
    }
}

async function copyAssets(src, dest) {
    try {
        await createFolder(dest);
        const entries = await fs.promises.readdir(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isFile()) {
                await copyFile(srcPath, destPath);
            } else if (entry.isDirectory()) {
                await copyAssets(srcPath, destPath);
            }
        }
    } catch (err) {
        console.error('Error copying folder:', err);
    }
}

async function buildPage() {
    try {
        await makeProjectDistFolder();
        await buildHTML();
        await buildCSS();
        await copyAssets(assetsPath, assetsCopyPath);
    } catch (err) {
        console.error('Error making buildPage:', err);
    }
}

buildPage();
