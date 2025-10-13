import type { Address } from 'viem';
import { useChainId, useReadContract } from 'wagmi';
import { resolverAbi } from '../abis/resolver';
import { getConfigForChainId } from '../config';
import { useAbstractNamesContext } from '../provider';

export interface UseResolveParams {
  /** The name to resolve (e.g., "vitalik" or "vitalik.abs") */
  name?: string;
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
 * Automatically uses the active chain from wagmi, or the chain specified in AbstractNamesProvider.
 *
 * @example
 * ```tsx
 * const { data: address, isLoading } = useResolve({
 *   name: 'vitalik.abs'
 * });
 * ```
 */
export function useResolve({
  name,
  enabled = true,
}: UseResolveParams): UseResolveResult {
  const wagmiChainId = useChainId();
  const context = useAbstractNamesContext();
  const chainId = context?.chainId ?? wagmiChainId;
  const config = getConfigForChainId(chainId);

  // Normalize name - remove .abs suffix if present
  const normalizedName = name?.replace(/\.abs$/, '');

  const { data, isLoading, error, refetch } = useReadContract({
    address: config?.resolverAddress,
    abi: resolverAbi,
    functionName: 'resolve',
    args: normalizedName ? [normalizedName] : undefined,
    query: {
      enabled: enabled && !!normalizedName && !!config,
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
