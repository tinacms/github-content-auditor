import { readFile, writeFile } from 'node:fs/promises';


console.log('version', process.version);
const posts = await readFile('posts.json', 'utf-8');

JSON.parse(posts);
console.log('Original Post:', posts);