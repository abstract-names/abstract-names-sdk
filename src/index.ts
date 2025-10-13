// Main exports - Hooks

// ABIs (for advanced usage)
export { registryAbi } from './abis/registry';
export { resolverAbi } from './abis/resolver';
// Config (for advanced usage)
export {
  ABSTRACT_MAINNET_CHAIN_ID,
  ABSTRACT_TESTNET_CHAIN_ID,
  getConfigForChainId,
} from './config';
export type {
  UseAllowedTextKeysParams,
  UseAllowedTextKeysResult,
} from './hooks/useAllowedTextKeys';
export { useAllowedTextKeys } from './hooks/useAllowedTextKeys';
export type {
  UseNameAvailabilityParams,
  UseNameAvailabilityResult,
} from './hooks/useNameAvailability';
export { useNameAvailability } from './hooks/useNameAvailability';
export type {
  NameExpiryData,
  UseNameExpiryParams,
  UseNameExpiryResult,
} from './hooks/useNameExpiry';
export { useNameExpiry } from './hooks/useNameExpiry';
export type { UseProfileParams, UseProfileResult } from './hooks/useProfile';
export { useProfile } from './hooks/useProfile';
export type { UseResolveParams, UseResolveResult } from './hooks/useResolve';
export { useResolve } from './hooks/useResolve';
export type {
  UseReverseResolveParams,
  UseReverseResolveResult,
} from './hooks/useReverseResolve';
export { useReverseResolve } from './hooks/useReverseResolve';
export type {
  UseTextRecordParams,
  UseTextRecordResult,
} from './hooks/useTextRecord';
export { useTextRecord } from './hooks/useTextRecord';
// Provider
export type { AbstractNamesProviderProps } from './provider';
export { AbstractNamesProvider } from './provider';
// Types
export type {
  AbstractNamesConfig,
  NameData,
  NameProfile,
  TextRecord,
  TextRecordKey,
} from './types';
export { TEXT_RECORD_KEYS } from './types';
