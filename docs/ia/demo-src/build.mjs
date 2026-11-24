import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.join(here, '..', 'interaction-demo.html');

let html = readFileSync(path.join(here, 'index.html'), 'utf8');
const css = readFileSync(path.join(here, 'styles.css'), 'utf8');
const js = readFileSync(path.join(here, 'app.js'), 'utf8').replaceAll('</script', '<\\/script');

html = html.replace(
  '  <link rel="stylesheet" href="styles.css">',
  `  <style>\n${css}\n  </style>`
);
html = html.replace(
  '  <script src="app.js"></script>',
  `  <script>\n${js}\n  </script>`
);
html = html.replace('<!doctype html>', '<!doctype html>\n<!-- Generated from docs/ia/demo-src by build.mjs; open this file directly. -->');

writeFileSync(outFile, html, 'utf8');
console.log(`Built ${outFile}`);
