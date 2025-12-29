import { useChainId, useReadContract } from 'wagmi';
import { registryAbi } from '../abis/registry';
import { resolverAbi } from '../abis/resolver';
import { getConfigForChainId } from '../config';
import type { AbstractNamesError } from '../errors';
import { parseContractError } from '../errors';
import { useAbstractNamesContext } from '../provider';
import type { TextRecordKey } from '../types';

export interface UseTextRecordParams {
  /** Name to get text record for (e.g., "vitalik" or "vitalik.abs") */
  name?: string;
  /** Text record key to fetch */
  key?: TextRecordKey | string;
  /** Enable/disable the query */
  enabled?: boolean;
}

export interface UseTextRecordResult {
  /** The text record value */
  data: string | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Structured error with user-friendly message */
  error: AbstractNamesError | null;
  /** Raw error from wagmi (for debugging) */
  rawError: Error | null;
  /** Refetch function */
  refetch: () => void;
}

/**
 * Hook to get a specific text record for a name
 *
 * More focused than useProfile when you only need one field.
 *
 * Automatically uses the active chain from wagmi, or the chain specified in AbstractNamesProvider.
 *
 * @example
 * ```tsx
 * const { data: avatar } = useTextRecord({
 *   name: 'vitalik.abs',
 *   key: 'avatar'
 * });
 *
 * const { data: twitter } = useTextRecord({
 *   name: 'vitalik.abs',
 *   key: 'com.x'
 * });
 * ```
 */
export function useTextRecord({
  name,
  key,
  enabled = true,
}: UseTextRecordParams): UseTextRecordResult {
  const wagmiChainId = useChainId();
  const context = useAbstractNamesContext();
  const chainId = context?.chainId ?? wagmiChainId;
  const config = getConfigForChainId(chainId);

  // Normalize name - remove .abs suffix if present
  const normalizedName = name?.replace(/\.abs$/, '');

  // First get tokenId
  const { data: tokenId } = useReadContract({
    address: config?.registryAddress,
    abi: registryAbi,
    functionName: 'getTokenId',
    args: normalizedName ? [normalizedName] : undefined,
    query: {
      enabled: enabled && !!normalizedName && !!config,
    },
  });

  // Then get text record
  const { data, isLoading, error, refetch } = useReadContract({
    address: config?.resolverAddress,
    abi: resolverAbi,
    functionName: 'getText',
    args: tokenId && key ? [tokenId, key] : undefined,
    query: {
      enabled: enabled && !!tokenId && tokenId !== 0n && !!key && !!config,
    },
  });

  // Filter out empty strings
  const textRecord = data && data !== '' ? data : undefined;

  return {
    data: textRecord,
    isLoading,
    error: parseContractError(error as Error | null),
    rawError: error as Error | null,
    refetch,
  };
}
