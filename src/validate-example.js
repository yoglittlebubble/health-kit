import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const schema = JSON.parse(
  await fs.readFile(path.join(root, 'schemas/daily-summary.schema.json'), 'utf8'),
);
const example = JSON.parse(
  await fs.readFile(path.join(root, 'examples/daily-summary.example.json'), 'utf8'),
);

const required = schema.required || [];
const missing = required.filter((k) => !(k in example));
if (missing.length) {
  console.error('Example missing required fields:', missing.join(', '));
  process.exit(1);
}
console.log('OK: example has all required fields:', required.join(', '));
