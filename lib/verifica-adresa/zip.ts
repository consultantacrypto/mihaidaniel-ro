import { inflateRawSync } from 'node:zlib';

/** Reads the first stored file from a ZIP archive. Enough for the single-file OFAC SDN zip. */
export function unzipFirstFile(buffer: Buffer): string {
  let offset = 0;
  while (offset + 30 <= buffer.length) {
    const signature = buffer.readUInt32LE(offset);
    if (signature !== 0x04034b50) break;

    const flags = buffer.readUInt16LE(offset + 6);
    const method = buffer.readUInt16LE(offset + 8);
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const nameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const nameStart = offset + 30;
    const name = buffer.subarray(nameStart, nameStart + nameLength).toString('utf8');
    const dataStart = nameStart + nameLength + extraLength;

    if (flags & 0x08 || compressedSize === 0) {
      throw new Error(`ZIP entry ${name} uses a data descriptor; refetch SDN.XML directly.`);
    }
    if (dataStart + compressedSize > buffer.length) {
      throw new Error('ZIP entry exceeds buffer.');
    }

    const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
    offset = dataStart + compressedSize;
    if (name.endsWith('/')) continue;

    if (method === 0) return compressed.toString('utf8');
    if (method === 8) return inflateRawSync(compressed).toString('utf8');
    throw new Error(`Unsupported ZIP compression method ${method}.`);
  }
  throw new Error('No file found in ZIP archive.');
}
