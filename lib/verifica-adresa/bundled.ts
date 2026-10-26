import raw from './data/sanctions-snapshot.json';
import { isSanctionsSnapshot, type SanctionsSnapshot } from './snapshot';

export function loadBundledSnapshot(): SanctionsSnapshot {
  if (!isSanctionsSnapshot(raw)) {
    throw new Error('Snapshot-ul de sancțiuni din repo este invalid.');
  }
  return raw;
}
