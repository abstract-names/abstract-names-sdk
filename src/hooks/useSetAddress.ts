import { useCallback } from 'react';
import type { Address } from 'viem';
import {
  useChainId,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { resolverAbi } from '../abis/resolver';
import { getConfigForChainId } from '../config';
import type { AbstractNamesError } from '../errors';
import { parseContractError } from '../errors';
import { useAbstractNamesContext } from '../provider';

export interface UseSetAddressParams {
  /** Callback fired when transaction hash is received */
  onSuccess?: (hash: `0x${string}`) => void;
  /** Callback fired when an error occurs */
  onError?: (error: AbstractNamesError) => void;
}

export interface UseSetAddressResult {
  /** Function to set the resolved address for a name */
  setAddress: (tokenId: bigint, address: Address) => Promise<`0x${string}`>;
  /** Whether the transaction is being prepared/sent */
  isPending: boolean;
  /** Whether waiting for transaction confirmation */
  isConfirming: boolean;
  /** Whether the transaction was confirmed successfully */
  isSuccess: boolean;
  /** Whether an error occurred */
  isError: boolean;
  /** The transaction hash (if transaction was sent) */
  transactionHash?: `0x${string}`;
  /** Structured error with user-friendly message */
  error: AbstractNamesError | null;
  /** Raw error from wagmi (for debugging) */
  rawError: Error | null;
  /** Reset the mutation state */
  reset: () => void;
}

/**
 * Hook to set the resolved address for a name
 *
 * By default, names resolve to the owner's address.
 * This function allows you to point the name to a different address.
 * Pass the zero address to revert back to the owner's address.
 *
 * Only the name owner can update the resolved address.
 *
 * Automatically uses the active chain from wagmi, or the chain specified in AbstractNamesProvider.
 *
 * @example
 * ```tsx
 * const { setAddress, isPending } = useSetAddress({
 *   onSuccess: (hash) => console.log('Address updated:', hash),
 *   onError: (error) => toast.error(error.userMessage),
 * });
 *
 * // Point name to a different address
 * await setAddress(tokenId, '0x1234...');
 *
 * // Revert to owner's address
 * await setAddress(tokenId, '0x0000000000000000000000000000000000000000');
 * ```
 */
export function useSetAddress({
  onSuccess,
  onError,
}: UseSetAddressParams = {}): UseSetAddressResult {
  const wagmiChainId = useChainId();
  const context = useAbstractNamesContext();
  const chainId = context?.chainId ?? wagmiChainId;
  const config = getConfigForChainId(chainId);

  const {
    writeContractAsync,
    data: hash,
    isPending,
    error: writeError,
    reset,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });

  const setAddress = useCallback(
    async (tokenId: bigint, address: Address): Promise<`0x${string}`> => {
      if (!config) {
        const error = new Error('Chain not supported');
        const parsedError = parseContractError(error);
        if (parsedError) {
          onError?.(parsedError);
        }
        throw parsedError;
      }

      try {
        const txHash = await writeContractAsync({
          address: config.resolverAddress,
          abi: resolverAbi,
          functionName: 'setAddress',
          args: [tokenId, address],
        });

        onSuccess?.(txHash);
        return txHash;
      } catch (err) {
        const parsedError = parseContractError(err as Error);
        if (parsedError) {
          onError?.(parsedError);
        }
        throw parsedError;
      }
    },
    [config, writeContractAsync, onSuccess, onError]
  );

  const rawError = writeError || receiptError;

  return {
    setAddress,
    isPending,
    isConfirming,
    isSuccess,
    isError: !!rawError,
    transactionHash: hash,
    error: parseContractError(rawError as Error | null),
    rawError: rawError as Error | null,
    reset,
  };
}
