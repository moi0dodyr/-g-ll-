const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getImages(dir) {
    let results = [];
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getImages(filePath));
        } else if (/\.(jpg|jpeg|png|gif)$/.test(file)) {
            const relativePath = filePath.replace(__dirname + path.sep, '').replace(/\\/g, '/');
            results.push(`<div><img src="${relativePath}"/></div>`);
        }
    });
    return results;
}

const images = getImages(srcDir);
fs.writeFileSync('imageList.json', JSON.stringify(images, null, 2));
console.log('Image list generated.');