
import { execFile } from 'node:child_process';
import path from 'path';
import { readFile, writeFile, stat as statAsync } from 'fs/promises';
import { promisify } from 'node:util';

const REPO_ROOT = path.resolve(process.cwd(), '../../..');

const main = async ()=> {
    await setLastUpdated("content/posts/future-of-remote-work-2025.mdx");
}

const execFileAsync = promisify(execFile);

async function getGitLastUpdated(filePath: string): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync('git', ['log', '-1', '--format=%cI', filePath], {
      cwd: REPO_ROOT,
    });
    const iso = stdout.trim();
    return iso || null;
  } catch {
    return null;
  }
}

async function getFsMtimeISO(filePath: string): Promise<string> {
  const s = await statAsync(filePath);
  return new Date(s.mtime).toISOString();
}

function addLastUpdated(raw: string, iso: string): { changed: boolean; output: string } {
  // Require existing YAML frontmatter; otherwise do nothing
  const fmRe = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = raw.match(fmRe);
  if (!match) return { changed: false, output: raw };

  const header = match[1];
  if(!header)
  {
    throw new Error("Failed to parse frontmatter header");
  }
  if (/^\s*lastUpdated\s*:/m.test(header)) {
    return { changed: false, output: raw };
  }

  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  const newHeader = header.replace(/\s*$/, '') + `${eol}lastUpdated: ${iso}`;
  const output = raw.replace(fmRe, `---${eol}${newHeader}${eol}---`);
  return { changed: true, output };
}

async function setLastUpdated(filePath: string) {

  const target = path.resolve(REPO_ROOT, filePath);
  let st;
  try {
    st = await statAsync(target);
  } catch {
    console.error(`File not found: ${path.relative(REPO_ROOT, target)}`);
    process.exit(1);
  }
  if (!st.isFile()) {
    console.error('Path is not a file.');
    process.exit(1);
  }
  const ext = path.extname(target).toLowerCase();
  if (!['.md', '.mdx'].includes(ext)) {
    console.error('Only .md/.mdx files are supported.');
    process.exit(1);
  }

  const raw = await readFile(target, 'utf8');
  const gitISO = await getGitLastUpdated(target);
  const iso = gitISO ?? (await getFsMtimeISO(target));

  const { changed, output } = addLastUpdated(raw, iso);
  if (changed) {
    await writeFile(target, output, 'utf8');
    console.log(`updated: ${path.relative(REPO_ROOT, target)}`);
  } else {
    console.log('No changes needed.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

main();