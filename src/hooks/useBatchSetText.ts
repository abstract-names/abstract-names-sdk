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

export interface UseBatchSetTextParams {
  /** Callback fired when transaction hash is received */
  onSuccess?: (hash: `0x${string}`) => void;
  /** Callback fired when an error occurs */
  onError?: (error: AbstractNamesError) => void;
}

export interface UseBatchSetTextResult {
  /** Function to set multiple text records in one transaction */
  batchSetText: (
    tokenId: bigint,
    keys: string[],
    values: string[]
  ) => Promise<`0x${string}`>;
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
 * Hook to set multiple text records in a single transaction
 *
 * More gas-efficient than calling setText multiple times.
 * Only the name owner can update text records.
 * All keys must be in the allowed text keys list.
 *
 * Automatically uses the active chain from wagmi, or the chain specified in AbstractNamesProvider.
 *
 * @example
 * ```tsx
 * const { batchSetText, isPending } = useBatchSetText({
 *   onSuccess: (hash) => console.log('Batch update sent:', hash),
 *   onError: (error) => toast.error(error.userMessage),
 * });
 *
 * // Update multiple social links
 * await batchSetText(
 *   tokenId,
 *   ['com.x', 'com.github', 'url'],
 *   ['@vitalik', 'vitalik', 'https://vitalik.ca']
 * );
 * ```
 */
export function useBatchSetText({
  onSuccess,
  onError,
}: UseBatchSetTextParams = {}): UseBatchSetTextResult {
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

  const batchSetText = useCallback(
    async (
      tokenId: bigint,
      keys: string[],
      values: string[]
    ): Promise<`0x${string}`> => {
      if (!config) {
        const error = new Error('Chain not supported');
        const parsedError = parseContractError(error);
        if (parsedError) {
          onError?.(parsedError);
        }
        throw parsedError;
      }

      if (keys.length !== values.length) {
        const error = new Error(
          'Keys and values arrays must have the same length'
        );
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
          functionName: 'batchSetText',
          args: [tokenId, keys, values],
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
    batchSetText,
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
