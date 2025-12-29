import { useMemo } from 'react';
import { formatEther } from 'viem';
import { useChainId, useReadContract } from 'wagmi';
import { controllerAbi } from '../abis/controller';
import { getConfigForChainId } from '../config';
import type { AbstractNamesError } from '../errors';
import { parseContractError } from '../errors';
import { useAbstractNamesContext } from '../provider';

export interface UseNamePriceParams {
  /** Name to get pricing for (e.g., "vitalik" or "vitalik.abs") */
  name?: string;
  /** Number of years to register (default: 1) */
  years?: number;
  /** Enable/disable the query */
  enabled?: boolean;
}

export interface NamePriceData {
  /** Price tier (0=Diamond, 1=Platinum, 2=Gold, 3=Normal) */
  tier: number;
  /** Annual price for this tier (in wei) */
  tierPrice: bigint;
  /** Total price for registration (tierPrice * years, in wei) */
  totalPrice: bigint;
  /** Total price formatted in ETH (e.g., "0.001") */
  totalPriceFormatted: string;
}

export interface UseNamePriceResult {
  /** Pricing data for the name */
  data: NamePriceData | undefined;
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
 * Hook to get pricing information for a name
 *
 * Calculates tier based on name length and fetches the corresponding price.
 * - Diamond (3 chars): 0.15 ETH/year
 * - Platinum (4 chars): 0.05 ETH/year
 * - Gold (5 chars): 0.01 ETH/year
 * - Normal (6+ chars): 0.001 ETH/year
 *
 * Automatically uses the active chain from wagmi, or the chain specified in AbstractNamesProvider.
 *
 * @example
 * ```tsx
 * const { data: pricing } = useNamePrice({
 *   name: 'vitalik',
 *   years: 2
 * });
 *
 * if (pricing) {
 *   console.log(`Tier: ${pricing.tier}`);
 *   console.log(`Total: ${pricing.totalPriceFormatted} ETH`);
 * }
 * ```
 */
export function useNamePrice({
  name,
  years = 1,
  enabled = true,
}: UseNamePriceParams): UseNamePriceResult {
  const wagmiChainId = useChainId();
  const context = useAbstractNamesContext();
  const chainId = context?.chainId ?? wagmiChainId;
  const config = getConfigForChainId(chainId);

  // Memoize input to prevent infinite loops in query dependencies
  const normalizedName = useMemo(
    () => name?.toLowerCase().replace(/\.abs$/, ''),
    [name]
  );

  // Simple transformation - React 19's compiler optimizes automatically
  const tier = normalizedName
    ? normalizedName.length === 3
      ? 0 // Diamond
      : normalizedName.length === 4
        ? 1 // Platinum
        : normalizedName.length === 5
          ? 2 // Gold
          : 3 // Normal (6+)
    : undefined;

  const {
    data: tierPrice,
    error: rawError,
    isLoading,
    refetch,
  } = useReadContract({
    address: config?.controllerAddress,
    abi: controllerAbi,
    functionName: 'getTierPrice',
    args: tier !== undefined ? [tier] : undefined,
    query: {
      enabled: enabled && !!config && tier !== undefined,
    },
  });

  // React 19 compiler optimizes object construction automatically
  const result =
    tierPrice !== undefined && tier !== undefined
      ? {
          tier,
          tierPrice,
          totalPrice: tierPrice * BigInt(years),
          totalPriceFormatted: formatEther(tierPrice * BigInt(years)),
        }
      : undefined;

  return {
    data: result,
    isLoading,
    error: parseContractError(rawError as Error | null),
    rawError: rawError as Error | null,
    refetch,
  };
}
