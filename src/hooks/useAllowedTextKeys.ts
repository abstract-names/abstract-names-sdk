import { useReadContract } from 'wagmi';
import { resolverAbi } from '../abis/resolver';
import type { AbstractNamesConfig } from '../types';

export interface UseAllowedTextKeysParams {
  /** Configuration with contract addresses */
  config: AbstractNamesConfig;
  /** Enable/disable the query */
  enabled?: boolean;
}

export interface UseAllowedTextKeysResult {
  /** Array of allowed text record keys */
  data: readonly string[] | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch function */
  refetch: () => void;
}

/**
 * Hook to get the list of allowed text record keys
 *
 * Useful for building profile editors and knowing which fields are supported.
 *
 * @example
 * ```tsx
 * const { data: allowedKeys } = useAllowedTextKeys({
 *   config: abstractTestnetConfig
 * });
 *
 * // Use in a form builder
 * {allowedKeys?.map(key => (
 *   <input key={key} placeholder={key} />
 * ))}
 * ```
 */
export function useAllowedTextKeys({
  config,
  enabled = true,
}: UseAllowedTextKeysParams): UseAllowedTextKeysResult {
  const { data, isLoading, error, refetch } = useReadContract({
    address: config.resolverAddress,
    abi: resolverAbi,
    functionName: 'getAllowedTextKeys',
    chainId: config.chainId,
    query: {
      enabled,
    },
  });

  return {
    data: data as readonly string[] | undefined,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
