import { useReadContract } from 'wagmi';
import { registryAbi } from '../abis/registry';
import type { AbstractNamesConfig } from '../types';

export interface UseNameAvailabilityParams {
  /** The name to check availability for (without .abs suffix) */
  name?: string;
  /** Configuration with contract addresses */
  config: AbstractNamesConfig;
  /** Enable/disable the query */
  enabled?: boolean;
}

export interface UseNameAvailabilityResult {
  /** Whether the name is available for registration */
  data: boolean | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch function */
  refetch: () => void;
}

/**
 * Hook to check if a name is available for registration
 *
 * @example
 * ```tsx
 * const { data: isAvailable, isLoading } = useNameAvailability({
 *   name: 'vitalik',
 *   config: abstractTestnetConfig
 * });
 *
 * if (isLoading) return <div>Checking...</div>;
 * if (isAvailable) return <div>Name available!</div>;
 * ```
 */
export function useNameAvailability({
  name,
  config,
  enabled = true,
}: UseNameAvailabilityParams): UseNameAvailabilityResult {
  // Normalize name - remove .abs suffix if present
  const normalizedName = name?.replace(/\.abs$/, '');

  const { data, isLoading, error, refetch } = useReadContract({
    address: config.registryAddress,
    abi: registryAbi,
    functionName: 'isAvailable',
    args: normalizedName ? [normalizedName] : undefined,
    chainId: config.chainId,
    query: {
      enabled: enabled && !!normalizedName && normalizedName.length >= 3,
    },
  });

  return {
    data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
