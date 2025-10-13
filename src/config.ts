import type { AbstractNamesConfig } from './types';

/**
 * Abstract testnet chain ID
 */
export const ABSTRACT_TESTNET_CHAIN_ID = 11124;

/**
 * Abstract mainnet chain ID
 */
export const ABSTRACT_MAINNET_CHAIN_ID = 2741;

/**
 * Configuration for Abstract Names on Abstract testnet
 */
const abstractTestnetConfig: AbstractNamesConfig = {
  registryAddress: '0x8c23D075eC4329ee5C9105D7BbAd413591251f0d',
  resolverAddress: '0x9fA78BFfe59a8E828d6d5ce3bf97C39a873239Dd',
  controllerAddress: '0xaaa8189eCFa758E7B340bC7c6E94D85c6d231f45',
  rendererAddress: '0x5792b0e5E61af4C88cB0015460E767d4b73bd2d9',
  validatorAddress: '0xE12f2a43d1cED53fBA541e8Cb69edc3f834f2359',
};

/**
 * Configuration for Abstract mainnet
 * Update these addresses after mainnet deployment
 */
const abstractMainnetConfig: AbstractNamesConfig = {
  registryAddress: '0x0000000000000000000000000000000000000000', // TODO: Deploy to mainnet
  resolverAddress: '0x0000000000000000000000000000000000000000', // TODO: Deploy to mainnet
  controllerAddress: '0x0000000000000000000000000000000000000000', // TODO: Deploy to mainnet
  rendererAddress: '0x0000000000000000000000000000000000000000', // TODO: Deploy to mainnet
  validatorAddress: '0x0000000000000000000000000000000000000000', // TODO: Deploy to mainnet
};

/**
 * Registry of configs by chain ID
 */
const configsByChainId: Record<number, AbstractNamesConfig> = {
  [ABSTRACT_TESTNET_CHAIN_ID]: abstractTestnetConfig,
  [ABSTRACT_MAINNET_CHAIN_ID]: abstractMainnetConfig,
};

/**
 * Get configuration for a specific chain ID
 *
 * Returns undefined for unsupported chains, which will cause hooks to be disabled.
 *
 * @param chainId - Chain ID from wagmi or provider
 * @returns Configuration for the specified chain, or undefined if not supported
 */
export function getConfigForChainId(
  chainId: number | undefined
): AbstractNamesConfig | undefined {
  if (!chainId) return undefined;
  return configsByChainId[chainId];
}
