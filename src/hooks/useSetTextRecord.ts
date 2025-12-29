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

export interface UseSetTextRecordParams {
  /** Callback fired when transaction hash is received */
  onSuccess?: (hash: `0x${string}`) => void;
  /** Callback fired when an error occurs */
  onError?: (error: AbstractNamesError) => void;
}

export interface UseSetTextRecordResult {
  /** Function to set a text record */
  setText: (
    tokenId: bigint,
    key: string,
    value: string
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
 * Hook to set a text record for a name
 *
 * Only the name owner can update text records.
 * The key must be in the allowed text keys list.
 *
 * Automatically uses the active chain from wagmi, or the chain specified in AbstractNamesProvider.
 *
 * @example
 * ```tsx
 * const { setText, isPending, isSuccess } = useSetTextRecord({
 *   onSuccess: (hash) => console.log('Transaction sent:', hash),
 *   onError: (error) => toast.error(error.userMessage),
 * });
 *
 * // Set avatar text record
 * await setText(tokenId, 'avatar', 'https://example.com/avatar.png');
 * ```
 */
export function useSetTextRecord({
  onSuccess,
  onError,
}: UseSetTextRecordParams = {}): UseSetTextRecordResult {
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

  const setText = useCallback(
    async (
      tokenId: bigint,
      key: string,
      value: string
    ): Promise<`0x${string}`> => {
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
          functionName: 'setText',
          args: [tokenId, key, value],
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
    setText,
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
