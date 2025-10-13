import type { Address } from 'viem';

/**
 * Configuration for Abstract Names contracts
 */
export interface AbstractNamesConfig {
  /** Address of the AbstractNamesRegistry contract */
  registryAddress: Address;
  /** Address of the AbstractNamesResolver contract */
  resolverAddress: Address;
  /** Address of the AbstractNamesController contract */
  controllerAddress: Address;
  /** Address of the AbstractNamesRenderer contract */
  rendererAddress: Address;
  /** Address of the AbstractNamesValidator contract */
  validatorAddress: Address;
  /** Chain ID where contracts are deployed */
  chainId: number;
}

/**
 * Complete profile data for an Abstract Name
 */
export interface NameProfile {
  /** Full name with TLD (e.g., "vitalik.abs") */
  name: string;
  /** Address the name resolves to */
  resolvedAddress: Address;
  /** Text record keys (e.g., ["avatar", "com.twitter"]) */
  keys: string[];
  /** Text record values (corresponding to keys) */
  values: string[];
  /** Content hash for decentralized content */
  contenthash: `0x${string}`;
}

/**
 * Name data from the registry contract
 */
export interface NameData {
  /** Timestamp when name was registered */
  registeredAt: bigint;
  /** Timestamp when registration expires */
  expiresAt: bigint;
  /** Name tier (0=Diamond, 1=Platinum, 2=Gold, 3=Normal) */
  tier: number;
  /** The normalized name string */
  name: string;
}

/**
 * Text record data
 */
export interface TextRecord {
  key: string;
  value: string;
}

/**
 * Supported text record keys
 */
export const TEXT_RECORD_KEYS = [
  'avatar',
  'description',
  'com.x',
  'com.discord',
  'com.telegram',
  'com.github',
  'url',
  'header',
] as const;

export type TextRecordKey = (typeof TEXT_RECORD_KEYS)[number];
