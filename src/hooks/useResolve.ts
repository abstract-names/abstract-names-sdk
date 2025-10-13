import { useReadContract } from 'wagmi';
import type { Address } from 'viem';
import { resolverAbi } from '../abis/resolver';
import type { AbstractNamesConfig } from '../types';

export interface UseResolveParams {
  /** The name to resolve (e.g., "vitalik" or "vitalik.abs") */
  name?: string;
  /** Configuration with contract addresses */
  config: AbstractNamesConfig;
  /** Enable/disable the query */
  enabled?: boolean;
}

export interface UseResolveResult {
  /** The resolved address */
  data: Address | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch function */
  refetch: () => void;
}

/**
 * Hook to resolve an Abstract Name to an address
 *
 * @example
 * ```tsx
 * const { data: address, isLoading } = useResolve({
 *   name: 'vitalik.abs',
 *   config: abstractTestnetConfig
 * });
 * ```
 */
export function useResolve({
  name,
  config,
  enabled = true,
}: UseResolveParams): UseResolveResult {
  // Normalize name - remove .abs suffix if present
  const normalizedName = name?.replace(/\.abs$/, '');

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: config.resolverAddress,
    abi: resolverAbi,
    functionName: 'resolve',
    args: normalizedName ? [normalizedName] : undefined,
    chainId: config.chainId,
    query: {
      enabled: enabled && !!normalizedName,
    },
  });

  // Filter out zero address
  const resolvedAddress =
    data && data !== '0x0000000000000000000000000000000000000000'
      ? data
      : undefined;

  return {
    data: resolvedAddress,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
