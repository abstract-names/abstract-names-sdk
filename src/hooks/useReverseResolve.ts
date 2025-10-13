import type { Address } from 'viem';
import { useChainId, useReadContract } from 'wagmi';
import { resolverAbi } from '../abis/resolver';
import { getConfigForChainId } from '../config';
import { useAbstractNamesContext } from '../provider';

export interface UseReverseResolveParams {
  /** The address to reverse resolve */
  address?: Address;
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
 * Automatically uses the active chain from wagmi, or the chain specified in AbstractNamesProvider.
 *
 * @example
 * ```tsx
 * const { data: name, isLoading } = useReverseResolve({
 *   address: '0x1234...'
 * });
 * ```
 */
export function useReverseResolve({
  address,
  enabled = true,
}: UseReverseResolveParams): UseReverseResolveResult {
  const wagmiChainId = useChainId();
  const context = useAbstractNamesContext();
  const chainId = context?.chainId ?? wagmiChainId;
  const config = getConfigForChainId(chainId);

  const { data, isLoading, error, refetch } = useReadContract({
    address: config?.resolverAddress,
    abi: resolverAbi,
    functionName: 'reverseResolve',
    args: address ? [address] : undefined,
    query: {
      enabled: enabled && !!address && !!config,
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
