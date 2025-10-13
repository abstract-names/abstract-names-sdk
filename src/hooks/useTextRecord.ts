import { useReadContract } from 'wagmi';
import { registryAbi } from '../abis/registry';
import { resolverAbi } from '../abis/resolver';
import type { AbstractNamesConfig, TextRecordKey } from '../types';

export interface UseTextRecordParams {
  /** Name to get text record for (e.g., "vitalik" or "vitalik.abs") */
  name?: string;
  /** Text record key to fetch */
  key?: TextRecordKey | string;
  /** Configuration with contract addresses */
  config: AbstractNamesConfig;
  /** Enable/disable the query */
  enabled?: boolean;
}

export interface UseTextRecordResult {
  /** The text record value */
  data: string | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch function */
  refetch: () => void;
}

/**
 * Hook to get a specific text record for a name
 *
 * More focused than useProfile when you only need one field.
 *
 * @example
 * ```tsx
 * const { data: avatar } = useTextRecord({
 *   name: 'vitalik.abs',
 *   key: 'avatar',
 *   config: abstractTestnetConfig
 * });
 *
 * const { data: twitter } = useTextRecord({
 *   name: 'vitalik.abs',
 *   key: 'com.x',
 *   config: abstractTestnetConfig
 * });
 * ```
 */
export function useTextRecord({
  name,
  key,
  config,
  enabled = true,
}: UseTextRecordParams): UseTextRecordResult {
  // Normalize name - remove .abs suffix if present
  const normalizedName = name?.replace(/\.abs$/, '');

  // First get tokenId
  const { data: tokenId } = useReadContract({
    address: config.registryAddress,
    abi: registryAbi,
    functionName: 'getTokenId',
    args: normalizedName ? [normalizedName] : undefined,
    chainId: config.chainId,
    query: {
      enabled: enabled && !!normalizedName,
    },
  });

  // Then get text record
  const { data, isLoading, error, refetch } = useReadContract({
    address: config.resolverAddress,
    abi: resolverAbi,
    functionName: 'getText',
    args: tokenId && key ? [tokenId, key] : undefined,
    chainId: config.chainId,
    query: {
      enabled: enabled && !!tokenId && tokenId !== 0n && !!key,
    },
  });

  // Filter out empty strings
  const textRecord = data && data !== '' ? data : undefined;

  return {
    data: textRecord,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
