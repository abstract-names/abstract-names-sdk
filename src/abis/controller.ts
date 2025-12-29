/**
 * ABI for the AbstractNamesController contract
 * Handles pricing tiers, phases, and registration management
 */
export const controllerAbi = [
  {
    type: 'function',
    name: 'getTierPrice',
    inputs: [{ name: 'tier', type: 'uint8', internalType: 'uint8' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTierFromLength',
    inputs: [{ name: 'length', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'getCurrentPhase',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRegistrationPrice',
    inputs: [
      { name: 'tier', type: 'uint8', internalType: 'uint8' },
      { name: 'yearsPaid', type: 'uint256', internalType: 'uint256' },
      { name: 'discountBps', type: 'uint16', internalType: 'uint16' },
      { name: 'user', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
] as const;
