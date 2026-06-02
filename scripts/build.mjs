// Compiles all src/**\/*.civet files to .ts siblings.
// Runs before `tstl` in the build pipeline.

import { compile } from '@danielx/civet';
import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';

const files = await glob('src/**/*.civet', { windowsPathsNoEscape: true });

if (files.length === 0) {
	console.warn('[civet] No .civet files found in src/');
	process.exit(0);
}

let errors = 0;
for (const file of files) {
	try {
		const source = await readFile(file, 'utf-8');
		const ts = await compile(source, { js: false });
		const outFile = file.replace(/\.civet$/, '.ts');
		await writeFile(outFile, ts);
		console.log(`[civet] ✓  ${file}  →  ${outFile}`);
	} catch (/** @type {any} */ e) {
		console.error(`[civet] ✗  ${file}\n         ${e.message}`);
		errors++;
	}
}

if (errors > 0) {
	console.error(`\n[civet] ${errors} file(s) failed to compile.`);
	process.exit(1);
}

console.log(`[civet] Built ${files.length} file(s).`);
