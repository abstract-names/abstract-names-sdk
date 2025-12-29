/**
 * ABI for the AbstractNamesValidator contract
 * Handles name validation and Unicode character range support
 */
export const validatorAbi = [
  {
    type: 'function',
    name: 'validateName',
    inputs: [{ name: 'name', type: 'string', internalType: 'string' }],
    outputs: [{ name: 'normalized', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getMinLength',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getMaxLength',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getSupportedRanges',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct INameValidator.UnicodeRange[]',
        components: [
          { name: 'start', type: 'uint32', internalType: 'uint32' },
          { name: 'end', type: 'uint32', internalType: 'uint32' },
        ],
      },
    ],
    stateMutability: 'view',
  },
] as const;
