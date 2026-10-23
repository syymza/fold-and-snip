import {mkdir,readFile,writeFile,copyFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const runtime=['index.html','style.css','app.js','geometry.js','fold-model.js','webb-data.js'];
await mkdir('dist',{recursive:true});
for(const file of runtime){const bytes=await readFile(file);assert(!/\/Users\/|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY|gh[pousr]_[A-Za-z0-9]{20,}/.test(bytes.toString()),`Unexpected private material in ${file}`);await copyFile(file,`dist/${file}`)}
await writeFile('dist/.nojekyll','');
await writeFile('dist/version.json',JSON.stringify({commit:process.env.GITHUB_SHA||'local'},null,2)+'\n');
const html=await readFile('dist/index.html','utf8');
for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){const ref=match[1];if(ref==='./'||/^(https:|#)/.test(ref))continue;assert(runtime.includes(ref),`Unknown or non-relative runtime asset: ${ref}`)}
assert.deepEqual((await readdir('dist')).sort(),[...runtime,'.nojekyll','version.json'].sort());
console.log(`Verified ${runtime.length} self-contained runtime files; artifact contains ${runtime.length+2} files.`);
