import TinaClient from "./services/tina-client";
import { setLastChecked } from "./utils/add-checked";
import extractFilePaths from "./utils/extract-file-paths";

const main = async ()=> {
    const tinaClient = new TinaClient(process.env.TINA_CLIENT_ID!, process.env.TINA_TOKEN!);
    var content = await tinaClient.getContent()
    var filePaths = extractFilePaths(content);
    var thing = filePaths.map(async (filePath)=> setLastChecked(filePath));
    await Promise.all(thing);
}


main().catch((err) => {
  console.error(err);
  process.exit(1);
});
