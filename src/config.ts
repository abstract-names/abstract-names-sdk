import type { Address } from 'viem';
import type { AbstractNamesConfig } from './types';

/**
 * Configuration for Abstract Names on Abstract testnet
 */
export const abstractTestnetConfig: AbstractNamesConfig = {
  registryAddress: '0x8c23D075eC4329ee5C9105D7BbAd413591251f0d',
  resolverAddress: '0x9fA78BFfe59a8E828d6d5ce3bf97C39a873239Dd',
  controllerAddress: '0xaaa8189eCFa758E7B340bC7c6E94D85c6d231f45',
  rendererAddress: '0x5792b0e5E61af4C88cB0015460E767d4b73bd2d9',
  validatorAddress: '0xE12f2a43d1cED53fBA541e8Cb69edc3f834f2359',
  chainId: 11124, // Abstract testnet
};

/**
 * Configuration for Abstract mainnet
 * Update these addresses after mainnet deployment
 */
export const abstractMainnetConfig: AbstractNamesConfig = {
  registryAddress: '0x0000000000000000000000000000000000000000', // TODO: Deploy to mainnet
  resolverAddress: '0x0000000000000000000000000000000000000000', // TODO: Deploy to mainnet
  controllerAddress: '0x0000000000000000000000000000000000000000', // TODO: Deploy to mainnet
  rendererAddress: '0x0000000000000000000000000000000000000000', // TODO: Deploy to mainnet
  validatorAddress: '0x0000000000000000000000000000000000000000', // TODO: Deploy to mainnet
  chainId: 2741, // Abstract mainnet
};

/**
 * Get configuration for a specific chain ID
 */
export function getConfig(chainId: number): AbstractNamesConfig {
  switch (chainId) {
    case 11124:
      return abstractTestnetConfig;
    case 2741:
      return abstractMainnetConfig;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
}

/**
 * Create a custom configuration
 */
export function createConfig(
  registryAddress: Address,
  resolverAddress: Address,
  controllerAddress: Address,
  rendererAddress: Address,
  validatorAddress: Address,
  chainId: number
): AbstractNamesConfig {
  return {
    registryAddress,
    resolverAddress,
    controllerAddress,
    rendererAddress,
    validatorAddress,
    chainId,
  };
}
