import { useReadContract } from 'wagmi';
import type { Address } from 'viem';
import { isAddress } from 'viem';
import { resolverAbi } from '../abis/resolver';
import { registryAbi } from '../abis/registry';
import type { AbstractNamesConfig, NameProfile } from '../types';

export interface UseProfileParams {
  /** Name (e.g., "vitalik.abs") or address to get profile for */
  nameOrAddress?: string;
  /** Configuration with contract addresses */
  config: AbstractNamesConfig;
  /** Enable/disable the query */
  enabled?: boolean;
}

export interface UseProfileResult {
  /** Complete profile data */
  data: NameProfile | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch function */
  refetch: () => void;
  /** Helper to get a specific text record */
  getTextRecord: (key: string) => string | undefined;
}

/**
 * Hook to get the complete profile for an Abstract Name or address
 *
 * If an address is provided, it fetches the primary name profile for that address.
 * If a name is provided, it fetches the profile for that name.
 *
 * @example
 * ```tsx
 * // By name
 * const { data: profile, getTextRecord } = useProfile({
 *   nameOrAddress: 'vitalik.abs',
 *   config: abstractTestnetConfig
 * });
 *
 * // By address (gets primary name profile)
 * const { data: profile } = useProfile({
 *   nameOrAddress: '0x1234...',
 *   config: abstractTestnetConfig
 * });
 *
 * // Get specific text record
 * const twitter = getTextRecord('com.twitter');
 * ```
 */
export function useProfile({
  nameOrAddress,
  config,
  enabled = true,
}: UseProfileParams): UseProfileResult {
  const isAddr = nameOrAddress ? isAddress(nameOrAddress) : false;

  // For names: first get tokenId, then get profile
  const normalizedName = !isAddr && nameOrAddress
    ? nameOrAddress.replace(/\.abs$/, '')
    : undefined;

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

  // Get profile by tokenId (for names)
  const {
    data: profileByTokenId,
    isLoading: isLoadingByTokenId,
    error: errorByTokenId,
    refetch: refetchByTokenId,
  } = useReadContract({
    address: config.resolverAddress,
    abi: resolverAbi,
    functionName: 'getNameData',
    args: tokenId ? [tokenId] : undefined,
    chainId: config.chainId,
    query: {
      enabled: enabled && !!tokenId && tokenId !== 0n,
    },
  });

  // Get profile by address (for addresses)
  const {
    data: profileByAddress,
    isLoading: isLoadingByAddress,
    error: errorByAddress,
    refetch: refetchByAddress,
  } = useReadContract({
    address: config.resolverAddress,
    abi: resolverAbi,
    functionName: 'getPrimaryData',
    args: isAddr && nameOrAddress ? [nameOrAddress as Address] : undefined,
    chainId: config.chainId,
    query: {
      enabled: enabled && isAddr && !!nameOrAddress,
    },
  });

  const profile = isAddr ? profileByAddress : profileByTokenId;
  const isLoading = isAddr ? isLoadingByAddress : isLoadingByTokenId;
  const error = isAddr ? errorByAddress : errorByTokenId;
  const refetch = isAddr ? refetchByAddress : refetchByTokenId;

  // Helper function to get a specific text record
  const getTextRecord = (key: string): string | undefined => {
    if (!profile) return undefined;
    const index = profile.keys.indexOf(key);
    return index !== -1 ? profile.values[index] : undefined;
  };

  // Filter out empty profiles
  const validProfile =
    profile && profile.name !== '' ? (profile as NameProfile) : undefined;

  return {
    data: validProfile,
    isLoading,
    error: error as Error | null,
    refetch,
    getTextRecord,
  };
}
