import { useCallback } from 'react';
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

export interface UseSetPrimaryNameParams {
  /** Callback fired when transaction hash is received */
  onSuccess?: (hash: `0x${string}`) => void;
  /** Callback fired when an error occurs */
  onError?: (error: AbstractNamesError) => void;
}

export interface UseSetPrimaryNameResult {
  /** Function to set a name as your primary name (requires fee) */
  setPrimaryName: (tokenId: bigint, fee: bigint) => Promise<`0x${string}`>;
  /** Function to unset your primary name (no fee) */
  unsetPrimaryName: () => Promise<`0x${string}`>;
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
 * Hook to set or unset your primary name
 *
 * Primary names enable reverse resolution (address → name.abs).
 * Setting a primary name requires payment of a fee.
 * Only the name owner can set it as their primary name.
 *
 * Automatically uses the active chain from wagmi, or the chain specified in AbstractNamesProvider.
 *
 * @example
 * ```tsx
 * const { setPrimaryName, unsetPrimaryName, isPending } = useSetPrimaryName({
 *   onSuccess: (hash) => console.log('Transaction sent:', hash),
 *   onError: (error) => toast.error(error.userMessage),
 * });
 *
 * // Set primary name (typical fee: 0.0001 ETH)
 * await setPrimaryName(tokenId, parseEther('0.0001'));
 *
 * // Remove primary name
 * await unsetPrimaryName();
 * ```
 */
export function useSetPrimaryName({
  onSuccess,
  onError,
}: UseSetPrimaryNameParams = {}): UseSetPrimaryNameResult {
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

  const setPrimaryName = useCallback(
    async (tokenId: bigint, fee: bigint): Promise<`0x${string}`> => {
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
          functionName: 'setPrimaryName',
          args: [tokenId],
          value: fee,
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

  const unsetPrimaryName = useCallback(async (): Promise<`0x${string}`> => {
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
        functionName: 'unsetPrimaryName',
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
  }, [config, writeContractAsync, onSuccess, onError]);

  const rawError = writeError || receiptError;

  return {
    setPrimaryName,
    unsetPrimaryName,
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
