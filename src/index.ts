// Main exports - Hooks

export { controllerAbi } from './abis/controller';
// ABIs (for advanced usage)
export { registryAbi } from './abis/registry';
export { resolverAbi } from './abis/resolver';
export { validatorAbi } from './abis/validator';
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
  UseBatchSetTextParams,
  UseBatchSetTextResult,
} from './hooks/useBatchSetText';
export { useBatchSetText } from './hooks/useBatchSetText';
export type {
  MintPhaseData,
  UseMintPhaseParams,
  UseMintPhaseResult,
} from './hooks/useMintPhase';
export { Phase, useMintPhase } from './hooks/useMintPhase';
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
export type {
  NamePriceData,
  UseNamePriceParams,
  UseNamePriceResult,
} from './hooks/useNamePrice';
export { useNamePrice } from './hooks/useNamePrice';
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
  UseSetAddressParams,
  UseSetAddressResult,
} from './hooks/useSetAddress';
export { useSetAddress } from './hooks/useSetAddress';
export type {
  UseSetPrimaryNameParams,
  UseSetPrimaryNameResult,
} from './hooks/useSetPrimaryName';
export { useSetPrimaryName } from './hooks/useSetPrimaryName';
export type {
  UseSetTextRecordParams,
  UseSetTextRecordResult,
} from './hooks/useSetTextRecord';
export { useSetTextRecord } from './hooks/useSetTextRecord';
export type {
  UseTextRecordParams,
  UseTextRecordResult,
} from './hooks/useTextRecord';
export { useTextRecord } from './hooks/useTextRecord';
export type {
  UseValidateNameParams,
  UseValidateNameResult,
  ValidateNameResult,
} from './hooks/useValidateName';
export { useValidateName } from './hooks/useValidateName';
export type { UseValidateNameDebouncedParams } from './hooks/useValidateNameDebounced';
export { useValidateNameDebounced } from './hooks/useValidateNameDebounced';
// Provider
export type { AbstractNamesProviderProps } from './provider';
export { AbstractNamesProvider } from './provider';
// Types
export type {
  AbstractNamesConfig,
  AbstractNamesError,
  NameData,
  NameProfile,
  TextRecord,
  TextRecordKey,
} from './types';
export { ErrorType, TEXT_RECORD_KEYS } from './types';
