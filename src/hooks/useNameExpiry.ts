import { useChainId, useReadContract } from 'wagmi';
import { registryAbi } from '../abis/registry';
import { getConfigForChainId } from '../config';
import { useAbstractNamesContext } from '../provider';

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
 * Automatically uses the active chain from wagmi, or the chain specified in AbstractNamesProvider.
 *
 * @example
 * ```tsx
 * const { data: expiry } = useNameExpiry({
 *   name: 'vitalik.abs'
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
  enabled = true,
}: UseNameExpiryParams): UseNameExpiryResult {
  const wagmiChainId = useChainId();
  const context = useAbstractNamesContext();
  const chainId = context?.chainId ?? wagmiChainId;
  const config = getConfigForChainId(chainId);

  // Normalize name - remove .abs suffix if present
  const normalizedName = name?.replace(/\.abs$/, '');

  // First get tokenId
  const { data: tokenId } = useReadContract({
    address: config?.registryAddress,
    abi: registryAbi,
    functionName: 'getTokenId',
    args: normalizedName ? [normalizedName] : undefined,
    query: {
      enabled: enabled && !!normalizedName && !!config,
    },
  });

  // Then get name data
  const {
    data: nameData,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: config?.registryAddress,
    abi: registryAbi,
    functionName: 'getNameData',
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: enabled && !!tokenId && tokenId !== 0n && !!config,
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
