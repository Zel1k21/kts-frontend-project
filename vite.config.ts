import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

import tsconfig from './tsconfig.json';

const SRC_PATH = path.resolve(__dirname, 'src');

const parseTsConfigPaths = (paths: Record<string, string[]>): Record<string, string> => {
  const viteConfigAliases: Record<string, string> = {};

  // console.log('Parsing TypeScript paths configuration:');
  // console.log('Paths object:', paths);

  Object.entries(paths).forEach(([alias, pathPatterns]) => {
    const pathPattern = pathPatterns[0];

    const directoryName = pathPattern.replace('/*', '');

    const cleanAlias = alias.replace('/*', '');

    const fullPath = path.join(SRC_PATH, directoryName);
    viteConfigAliases[cleanAlias] = fullPath;

    // console.log(`Alias: "${cleanAlias}" -> "${fullPath}" (from pattern: "${pathPattern}")`);
  });

  // console.log('Generated Vite aliases:', viteConfigAliases);
  return viteConfigAliases;
};

const aliases = parseTsConfigPaths(tsconfig.compilerOptions.paths);

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: aliases,
  },
});
