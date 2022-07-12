const fs = require('fs');
const p = require('./package.json');

const parts = p.version.split('.');
parts[parts.length - 1] = 1 + (Number(parts[parts.length - 1]));
p.version = parts.join('.');

fs.writeFileSync('./package.json', JSON.stringify(p, null, 2));