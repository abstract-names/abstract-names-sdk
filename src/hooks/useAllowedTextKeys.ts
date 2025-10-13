import { useChainId, useReadContract } from 'wagmi';
import { resolverAbi } from '../abis/resolver';
import { getConfigForChainId } from '../config';
import { useAbstractNamesContext } from '../provider';

export interface UseAllowedTextKeysParams {
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
 * Automatically uses the active chain from wagmi, or the chain specified in AbstractNamesProvider.
 *
 * @example
 * ```tsx
 * const { data: allowedKeys } = useAllowedTextKeys();
 *
 * // Use in a form builder
 * {allowedKeys?.map(key => (
 *   <input key={key} placeholder={key} />
 * ))}
 * ```
 */
export function useAllowedTextKeys({
  enabled = true,
}: UseAllowedTextKeysParams = {}): UseAllowedTextKeysResult {
  const wagmiChainId = useChainId();
  const context = useAbstractNamesContext();
  const chainId = context?.chainId ?? wagmiChainId;
  const config = getConfigForChainId(chainId);

  const { data, isLoading, error, refetch } = useReadContract({
    address: config?.resolverAddress,
    abi: resolverAbi,
    functionName: 'getAllowedTextKeys',
    query: {
      enabled: enabled && !!config,
    },
  });

  return {
    data: data as readonly string[] | undefined,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
