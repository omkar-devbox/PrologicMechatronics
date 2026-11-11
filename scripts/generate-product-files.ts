import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { productsData } from '../src/data/products/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.resolve(__dirname, '../src/data/products');

for (const [key, val] of Object.entries(productsData)) {
  fs.writeFileSync(path.join(outDir, `${key}.json`), JSON.stringify(val, null, 2));
}

console.log(`Generated ${Object.keys(productsData).length} product JSON files.`);
