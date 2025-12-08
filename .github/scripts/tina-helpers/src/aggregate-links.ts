import { aggregateContent } from './utils/aggregate-links'

export async function main(): Promise<void> {

  const paths = await aggregateContent(2);

  console.log(JSON.stringify(paths));
}
main();