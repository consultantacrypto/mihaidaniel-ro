import { createHash } from 'node:crypto';

export type Network = 'btc' | 'evm' | 'tron' | 'sol';

export type DetectedAddress = {
  network: Network;
  /** Canonical form used for sanctions lookup. */
  address: string;
};

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const BECH32_CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const BECH32_GENERATORS = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

export function cleanAddressInput(raw: string): string {
  return raw.trim().replace(/\s+/g, '').replace(/[.,;]+$/g, '');
}

export function detectNetwork(raw: string): DetectedAddress | null {
  if (typeof raw !== 'string') return null;
  const value = cleanAddressInput(raw);
  if (!value || value.length > 256) return null;

  if (/^0x/i.test(value)) {
    return detectEvm(value);
  }
  if (/^bc1/i.test(value)) {
    return detectBtcBech32(value);
  }
  if (/^[13]/.test(value)) {
    return detectBtcBase58(value);
  }
  if (value.startsWith('T') && value.length === 34) {
    return detectTron(value);
  }
  if (value.length >= 32 && value.length <= 44) {
    return detectSol(value);
  }
  return null;
}

function detectEvm(value: string): DetectedAddress | null {
  if (!/^0x[0-9a-fA-F]{40}$/i.test(value)) return null;
  return { network: 'evm', address: value.toLowerCase() };
}

function detectBtcBase58(value: string): DetectedAddress | null {
  const decoded = base58Check(value);
  if (!decoded || decoded.payload.length !== 20) return null;
  if (decoded.version !== 0x00 && decoded.version !== 0x05) return null;
  return { network: 'btc', address: value };
}

function detectBtcBech32(value: string): DetectedAddress | null {
  const decoded = decodeBech32(value);
  if (!decoded || decoded.hrp !== 'bc') return null;
  return { network: 'btc', address: value.toLowerCase() };
}

function detectTron(value: string): DetectedAddress | null {
  const decoded = base58Check(value);
  if (!decoded || decoded.version !== 0x41 || decoded.payload.length !== 20) return null;
  return { network: 'tron', address: value };
}

function detectSol(value: string): DetectedAddress | null {
  const decoded = decodeBase58(value);
  if (!decoded || decoded.length !== 32) return null;
  return { network: 'sol', address: value };
}

function sha256(data: Uint8Array): Uint8Array {
  return createHash('sha256').update(data).digest();
}

export function decodeBase58(input: string): Uint8Array | null {
  if (!input) return null;
  let zeros = 0;
  while (zeros < input.length && input[zeros] === '1') zeros += 1;

  const ZERO = BigInt(0);
  const BASE = BigInt(58);
  const BYTE = BigInt(255);
  let value = ZERO;
  for (const char of input) {
    const digit = BASE58_ALPHABET.indexOf(char);
    if (digit === -1) return null;
    value = value * BASE + BigInt(digit);
  }

  const bytes: number[] = [];
  while (value > ZERO) {
    bytes.push(Number(value & BYTE));
    value >>= BigInt(8);
  }
  bytes.reverse();

  const out = new Uint8Array(zeros + bytes.length);
  out.set(bytes, zeros);
  return out;
}

function base58Check(input: string): { version: number; payload: Uint8Array } | null {
  const decoded = decodeBase58(input);
  if (!decoded || decoded.length < 5) return null;
  const data = decoded.subarray(0, -4);
  const checksum = decoded.subarray(-4);
  const hash = sha256(sha256(data)).subarray(0, 4);
  for (let i = 0; i < 4; i += 1) {
    if (checksum[i] !== hash[i]) return null;
  }
  return { version: data[0], payload: data.subarray(1) };
}

function bech32Polymod(values: number[]): number {
  let chk = 1;
  for (const value of values) {
    const top = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ value;
    for (let i = 0; i < 5; i += 1) {
      if ((top >> i) & 1) chk ^= BECH32_GENERATORS[i];
    }
  }
  return chk;
}

function hrpExpand(hrp: string): number[] {
  const result: number[] = [];
  for (const char of hrp) result.push(char.charCodeAt(0) >> 5);
  result.push(0);
  for (const char of hrp) result.push(char.charCodeAt(0) & 31);
  return result;
}

function verifyBech32Checksum(hrp: string, data: number[], spec: 'bech32' | 'bech32m'): boolean {
  const constant = spec === 'bech32' ? 1 : 0x2bc830a3;
  return bech32Polymod(hrpExpand(hrp).concat(data)) === constant;
}

function convertBits(data: number[], from: number, to: number, pad: boolean): number[] | null {
  let acc = 0;
  let bits = 0;
  const result: number[] = [];
  const maxv = (1 << to) - 1;
  for (const value of data) {
    if (value < 0 || value >> from !== 0) return null;
    acc = (acc << from) | value;
    bits += from;
    while (bits >= to) {
      bits -= to;
      result.push((acc >> bits) & maxv);
    }
  }
  if (pad) {
    if (bits > 0) result.push((acc << (to - bits)) & maxv);
  } else if (bits >= from || ((acc << (to - bits)) & maxv) !== 0) {
    return null;
  }
  return result;
}

function decodeBech32(input: string): { hrp: string; witnessVersion: number; program: Uint8Array } | null {
  if (input !== input.toLowerCase() && input !== input.toUpperCase()) return null;
  const lower = input.toLowerCase();
  const separator = lower.lastIndexOf('1');
  if (separator < 1 || separator + 7 > lower.length) return null;
  const hrp = lower.slice(0, separator);
  const data: number[] = [];
  for (const char of lower.slice(separator + 1)) {
    const digit = BECH32_CHARSET.indexOf(char);
    if (digit === -1) return null;
    data.push(digit);
  }
  if (data.length < 7) return null;

  const spec = verifyBech32Checksum(hrp, data, 'bech32')
    ? 'bech32'
    : verifyBech32Checksum(hrp, data, 'bech32m')
      ? 'bech32m'
      : null;
  if (!spec) return null;

  const payload = data.slice(0, -6);
  const witnessVersion = payload[0];
  if (witnessVersion === undefined || witnessVersion < 0 || witnessVersion > 16) return null;
  if (witnessVersion === 0 && spec !== 'bech32') return null;
  if (witnessVersion !== 0 && spec !== 'bech32m') return null;

  const programBytes = convertBits(payload.slice(1), 5, 8, false);
  if (!programBytes) return null;
  if (programBytes.length < 2 || programBytes.length > 40) return null;
  if (witnessVersion === 0 && programBytes.length !== 20 && programBytes.length !== 32) return null;
  if (witnessVersion === 1 && programBytes.length !== 32) return null;
  return { hrp, witnessVersion, program: Uint8Array.from(programBytes) };
}
