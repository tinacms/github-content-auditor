import { aggregateContent } from './utils/aggregate-links'

export async function main(): Promise<void> {

  const items = process.env.TINA_AUDITOR_CONTENT_WINDOW

  if(!items) {
    console.error("Error: TINA_AUDITOR_CONTENT_WINDOW is not set in environment variables.");
    process.exit(1);
  }
  
  const paths = await aggregateContent(Number(items));

  console.log(JSON.stringify(paths));
}

main();