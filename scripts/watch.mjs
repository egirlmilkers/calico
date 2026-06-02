// Watches src/**\/*.civet for changes and recompiles to .ts.
// Run alongside `tstl --watch` via `pnpm dev`.

import { compile } from '@danielx/civet';
import { readFile, writeFile } from 'fs/promises';
import chokidar from 'chokidar';

/**
 * @param {string} file
 */
async function compileFile(file) {
	try {
		const source = await readFile(file, 'utf-8');
		const ts = await compile(source, { js: false });
		const outFile = file.replace(/\.civet$/, '.ts');
		await writeFile(outFile, ts);
		console.log(`[civet] ✓  ${file}`);
	} catch (/** @type {any} */ e) {
		console.error(`[civet] ✗  ${file}\n         ${e.message}`);
	}
}

// ignoreInitial: false → compile everything on startup, then watch for changes
const watcher = chokidar.watch('src/**/*.civet', {
	ignoreInitial: false,
	usePolling: false,
	awaitWriteFinish: { stabilityThreshold: 80, pollInterval: 20 },
});

watcher.on('add', compileFile);
watcher.on('change', compileFile);
watcher.on('ready', () => console.log('[civet] Watching src/**/*.civet …'));
