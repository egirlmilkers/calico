// scripts/clean-ts.mjs
// Removes generated .ts files that pair with .civet sources.

import { unlink } from 'fs/promises';
import { glob } from 'glob';

const tsFiles = await glob('src/**/*.ts', { windowsPathsNoEscape: true });
let removed = 0;

for (const file of tsFiles) {
	try {
		await unlink(file);
		console.log(`[clean] removed ${file}`);
		removed++;
	} catch {
		// ignore if already gone
	}
}

console.log(`[clean] Removed ${removed} generated .ts file(s).`);
