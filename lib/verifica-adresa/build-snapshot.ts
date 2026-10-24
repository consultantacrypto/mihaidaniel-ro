import { writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { fetchOfficialSnapshot } from './fetch-lists';

async function main(): Promise<void> {
  const ofacPath = process.env.OFAC_XML_PATH;
  const euPath = process.env.EU_XML_PATH;

  const result = await fetchOfficialSnapshot({
    ofacXml: ofacPath ? readFileSync(ofacPath, 'utf8') : undefined,
    euXml: euPath ? readFileSync(euPath, 'utf8') : undefined,
  });

  if (!result.ok) {
    console.error(result.error);
    process.exit(1);
  }

  const target = new URL('./data/sanctions-snapshot.json', import.meta.url);
  await writeFile(target, `${JSON.stringify(result.snapshot, null, 2)}\n`);

  const counts = Object.fromEntries(result.snapshot.sources.map((source) => [source.id, source.addressCount]));
  console.log(
    JSON.stringify({
      generatedAt: result.snapshot.generatedAt,
      addresses: result.snapshot.addresses.length,
      counts,
      file: target.pathname,
    }),
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
