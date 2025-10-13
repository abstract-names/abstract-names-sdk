import { useReadContract } from 'wagmi';
import type { Address } from 'viem';
import { resolverAbi } from '../abis/resolver';
import type { AbstractNamesConfig } from '../types';

export interface UseReverseResolveParams {
  /** The address to reverse resolve */
  address?: Address;
  /** Configuration with contract addresses */
  config: AbstractNamesConfig;
  /** Enable/disable the query */
  enabled?: boolean;
}

export interface UseReverseResolveResult {
  /** The primary name (with .abs suffix) */
  data: string | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch function */
  refetch: () => void;
}

/**
 * Hook to reverse resolve an address to its primary Abstract Name
 *
 * @example
 * ```tsx
 * const { data: name, isLoading } = useReverseResolve({
 *   address: '0x1234...',
 *   config: abstractTestnetConfig
 * });
 * ```
 */
export function useReverseResolve({
  address,
  config,
  enabled = true,
}: UseReverseResolveParams): UseReverseResolveResult {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: config.resolverAddress,
    abi: resolverAbi,
    functionName: 'reverseResolve',
    args: address ? [address] : undefined,
    chainId: config.chainId,
    query: {
      enabled: enabled && !!address,
    },
  });

  // Filter out empty strings
  const resolvedName = data && data !== '' ? data : undefined;

  return {
    data: resolvedName,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
