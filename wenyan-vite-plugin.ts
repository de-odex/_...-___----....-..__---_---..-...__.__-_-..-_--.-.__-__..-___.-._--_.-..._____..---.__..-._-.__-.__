import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { PluginOption } from 'vite';
import wenyan_ from '@wenyan/core';
const { compile } = wenyan_

export default function wenyan(options = {}): PluginOption {
  return {
    name: 'vite:wenyan',
    enforce: 'pre',

    resolveId(id, importer) {
      if ([".wy", ".文言", "經", "篇", "章", "書"].some(ext => id.endsWith(ext))) {
        return path.resolve(path.dirname(importer), id);
      }
    },

    async load(id) {
      if (!([".wy", ".文言", "經", "篇", "章", "書"].some(ext => id.endsWith(ext)))) return;
      const src = await readFile(id, 'utf8');
      const code = compile(src, options);  // CJS
      return `
        ${code}
        // Adapt CommonJS export to ESM
        export default module.exports ?? {};
        export const { ...named } = module.exports ?? {};
      `;
    }
  };
}