import { aggregateContent } from './utils/aggregate-links'

export async function main(): Promise<void> {

  const paths = await aggregateContent(10);

  console.log(JSON.stringify(paths));
}
main();