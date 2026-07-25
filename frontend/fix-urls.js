const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('http://localhost:5200')) {
    let newContent = content.replace(/['"]http:\/\/localhost:5200([^'"]*)['"]/g, '`${getBackendUrl()}$1`');
    
    // Ensure getBackendUrl is imported if we modified the file
    if (newContent !== content && !newContent.includes('getBackendUrl')) {
      // Find the last import statement to append our import
      const importMatch = [...newContent.matchAll(/^import .* from .*$/gm)];
      if (importMatch.length > 0) {
        const lastImportIndex = importMatch[importMatch.length - 1].index + importMatch[importMatch.length - 1][0].length;
        const relativePathToUtils = path.relative(path.dirname(filePath), path.join(__dirname, 'src/utils/api')).replace(/\\/g, '/');
        const importStmt = `\nimport { getBackendUrl } from '${relativePathToUtils.startsWith('.') ? relativePathToUtils : './' + relativePathToUtils}';`;
        newContent = newContent.slice(0, lastImportIndex) + importStmt + newContent.slice(lastImportIndex);
      } else {
        const relativePathToUtils = path.relative(path.dirname(filePath), path.join(__dirname, 'src/utils/api')).replace(/\\/g, '/');
        newContent = `import { getBackendUrl } from '${relativePathToUtils.startsWith('.') ? relativePathToUtils : './' + relativePathToUtils}';\n` + newContent;
      }
    }
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated:', filePath);
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
