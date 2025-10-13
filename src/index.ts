// Main exports
export { useResolve } from './hooks/useResolve';
export { useReverseResolve } from './hooks/useReverseResolve';
export { useProfile } from './hooks/useProfile';

// Types
export type {
  AbstractNamesConfig,
  NameProfile,
  NameData,
  TextRecord,
  TextRecordKey,
} from './types';
export { TEXT_RECORD_KEYS } from './types';

// Config
export {
  abstractTestnetConfig,
  abstractMainnetConfig,
  getConfig,
  createConfig,
} from './config';

// ABIs (for advanced usage)
export { resolverAbi } from './abis/resolver';
export { registryAbi } from './abis/registry';

// Re-export hook types
export type { UseResolveParams, UseResolveResult } from './hooks/useResolve';
export type {
  UseReverseResolveParams,
  UseReverseResolveResult,
} from './hooks/useReverseResolve';
export type { UseProfileParams, UseProfileResult } from './hooks/useProfile';
