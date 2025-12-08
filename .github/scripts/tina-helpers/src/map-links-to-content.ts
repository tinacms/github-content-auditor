import { readFile } from 'node:fs/promises';
import type { FileData } from './types';

const ROOT_DIR = "../../../"

const mapFileContents = async (path: string) : Promise<FileData> => {
  const content = await readFile(`${ROOT_DIR}${path}`, {encoding: "utf-8"});
  return {path, content};
}

export async function main(): Promise<void> {
  const content = process.argv[2];

    if(!content)
    {
        console.error("expected an argument containing a JSON array of strings");
        process.exit(1);    
    }

  const paths : Array<string> = JSON.parse(content);
  
  const mappedFiles =  paths.map(async (path)=>  mapFileContents(path));

  const contents = await Promise.all(mappedFiles);

  console.log(JSON.stringify(contents));
}

main();