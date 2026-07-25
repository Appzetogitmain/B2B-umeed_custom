const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('getBackendUrl(') && !content.includes('import { getBackendUrl }') && !content.includes('export { getBackendUrl')) {
    const relativePathToUtils = path.relative(path.dirname(filePath), path.join(__dirname, 'src/utils/api')).replace(/\\/g, '/');
    let importPath = relativePathToUtils.startsWith('.') ? relativePathToUtils : './' + relativePathToUtils;
    const importStmt = `import { getBackendUrl } from '${importPath}';\n`;
    
    // Add import statement at the beginning of the file
    let newContent = importStmt + content;
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Added import to:', filePath);
  }
};

const walkSync = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkSync(filePath);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      replaceInFile(filePath);
    }
  }
};

walkSync(directoryPath);
console.log('Done.');
