import { useReadContract } from 'wagmi';
import { registryAbi } from '../abis/registry';
import type { AbstractNamesConfig } from '../types';

export interface NameExpiryData {
  /** Timestamp when name was registered */
  registeredAt: bigint;
  /** Timestamp when registration expires */
  expiresAt: bigint;
  /** Name tier (0=Diamond, 1=Platinum, 2=Gold, 3=Normal) */
  tier: number;
  /** Whether the name is currently expired */
  isExpired: boolean;
  /** Days until expiry (negative if expired) */
  daysUntilExpiry: number;
}

export interface UseNameExpiryParams {
  /** Name to check (e.g., "vitalik" or "vitalik.abs") */
  name?: string;
  /** Configuration with contract addresses */
  config: AbstractNamesConfig;
  /** Enable/disable the query */
  enabled?: boolean;
}

export interface UseNameExpiryResult {
  /** Expiry data for the name */
  data: NameExpiryData | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch function */
  refetch: () => void;
}

/**
 * Hook to get expiration information for a name
 *
 * @example
 * ```tsx
 * const { data: expiry } = useNameExpiry({
 *   name: 'vitalik.abs',
 *   config: abstractTestnetConfig
 * });
 *
 * if (expiry?.isExpired) {
 *   return <div>This name has expired</div>;
 * }
 *
 * if (expiry && expiry.daysUntilExpiry < 30) {
 *   return <div>Expires in {expiry.daysUntilExpiry} days</div>;
 * }
 * ```
 */
export function useNameExpiry({
  name,
  config,
  enabled = true,
}: UseNameExpiryParams): UseNameExpiryResult {
  // Normalize name - remove .abs suffix if present
  const normalizedName = name?.replace(/\.abs$/, '');

  // First get tokenId
  const { data: tokenId } = useReadContract({
    address: config.registryAddress,
    abi: registryAbi,
    functionName: 'getTokenId',
    args: normalizedName ? [normalizedName] : undefined,
    chainId: config.chainId,
    query: {
      enabled: enabled && !!normalizedName,
    },
  });

  // Then get name data
  const {
    data: nameData,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: config.registryAddress,
    abi: registryAbi,
    functionName: 'getNameData',
    args: tokenId ? [tokenId] : undefined,
    chainId: config.chainId,
    query: {
      enabled: enabled && !!tokenId && tokenId !== 0n,
    },
  });

  // Calculate expiry info
  let expiryData: NameExpiryData | undefined;
  if (nameData) {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const isExpired = nameData.expiresAt <= now;
    const secondsUntilExpiry = Number(nameData.expiresAt - now);
    const daysUntilExpiry = Math.floor(secondsUntilExpiry / 86400);

    expiryData = {
      registeredAt: nameData.registeredAt,
      expiresAt: nameData.expiresAt,
      tier: nameData.tier,
      isExpired,
      daysUntilExpiry,
    };
  }

  return {
    data: expiryData,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
