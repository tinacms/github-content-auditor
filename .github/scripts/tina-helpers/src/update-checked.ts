import {setLastChecked} from './utils/add-checked';

const main = async () => {
  const filePaths = process.argv[2];
    // console.log(filePaths);
    // return
  if (!filePaths) {
    console.error('Error: Expected file paths as an argument.');
    process.exit(1);
  }
  const paths : Array<string> = JSON.parse(filePaths);

  await Promise.all(paths.map((path)=> setLastChecked(path)));
}

main();