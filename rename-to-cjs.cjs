const fs = require('fs');
const path = require('path');

// Recursively find and rename .js files to .cjs in src/cjs
const renameJsToCjs = (dir) => {
  const files = fs.readdirSync(dir);
  
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.lstatSync(filePath);
    
    if (stat.isDirectory()) {
      renameJsToCjs(filePath);
    } else if (file.endsWith('.js')) {
      const newPath = filePath.replace(/\.js$/, '.cjs');
      fs.renameSync(filePath, newPath);
      console.log(`Renamed: ${filePath} -> ${newPath}`);
    }
  });
};

const cjsDir = path.join(__dirname, 'src', 'cjs');
if (fs.existsSync(cjsDir)) {
  renameJsToCjs(cjsDir);
  console.log('All .js files renamed to .cjs');
} else {
  console.error('src/cjs directory not found');
  process.exit(1);
}

