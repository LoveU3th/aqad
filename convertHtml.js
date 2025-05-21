const fs = require('fs');
const path = require('path');

// 读取源文件
const sourceFile = path.join(__dirname, 'functions', 'htmlContent.js');
console.log('正在读取文件:', sourceFile);
const sourceContent = fs.readFileSync(sourceFile, 'utf8');
console.log('文件内容长度:', sourceContent.length);

// 提取HTML内容
const startMarker = 'export const INDEX_HTML = `';
const endMarker = '`;  // 确保添加反引号和分号';

const startIndex = sourceContent.indexOf(startMarker);
const endIndex = sourceContent.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('未找到HTML内容！');
    console.error('startIndex:', startIndex);
    console.error('endIndex:', endIndex);
    process.exit(1);
}

const htmlContent = sourceContent.substring(startIndex + startMarker.length, endIndex);

// 确保public目录存在
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
    console.log('创建public目录');
}

// 写入目标文件
const targetFile = path.join(publicDir, 'index.html');
fs.writeFileSync(targetFile, htmlContent);

console.log('转换完成！');
console.log(`HTML内容已保存到: ${targetFile}`); 