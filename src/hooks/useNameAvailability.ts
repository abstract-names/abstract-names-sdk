import { useChainId, useReadContract } from 'wagmi';
import { registryAbi } from '../abis/registry';
import { getConfigForChainId } from '../config';
import type { AbstractNamesError } from '../errors';
import { parseContractError } from '../errors';
import { useAbstractNamesContext } from '../provider';

export interface UseNameAvailabilityParams {
  /** The name to check availability for (without .abs suffix) */
  name?: string;
  /** Enable/disable the query */
  enabled?: boolean;
}

export interface UseNameAvailabilityResult {
  /** Whether the name is available for registration */
  data: boolean | undefined;
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
 * Hook to check if a name is available for registration
 *
 * Automatically uses the active chain from wagmi, or the chain specified in AbstractNamesProvider.
 *
 * @example
 * ```tsx
 * const { data: isAvailable, isLoading } = useNameAvailability({
 *   name: 'vitalik'
 * });
 *
 * if (isLoading) return <div>Checking...</div>;
 * if (isAvailable) return <div>Name available!</div>;
 * ```
 */
export function useNameAvailability({
  name,
  enabled = true,
}: UseNameAvailabilityParams): UseNameAvailabilityResult {
  const wagmiChainId = useChainId();
  const context = useAbstractNamesContext();
  const chainId = context?.chainId ?? wagmiChainId;
  const config = getConfigForChainId(chainId);

  // Normalize name - remove .abs suffix if present
  const normalizedName = name?.replace(/\.abs$/, '');

  const { data, isLoading, error, refetch } = useReadContract({
    address: config?.registryAddress,
    abi: registryAbi,
    functionName: 'isAvailable',
    args: normalizedName ? [normalizedName] : undefined,
    query: {
      enabled:
        enabled && !!normalizedName && normalizedName.length >= 3 && !!config,
    },
  });

  return {
    data,
    isLoading,
    error: parseContractError(error as Error | null),
    rawError: error as Error | null,
    refetch,
  };
}
