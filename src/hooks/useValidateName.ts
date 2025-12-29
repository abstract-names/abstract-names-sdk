import { useMemo } from 'react';
import { useChainId, useReadContract } from 'wagmi';
import { validatorAbi } from '../abis/validator';
import { getConfigForChainId } from '../config';
import type { AbstractNamesError } from '../errors';
import { parseContractError } from '../errors';
import { useAbstractNamesContext } from '../provider';

export interface UseValidateNameParams {
  /** Name to validate (e.g., "vitalik" or "vitalik.abs") */
  name?: string;
  /** Enable/disable the query */
  enabled?: boolean;
}

export interface ValidateNameResult {
  /** Whether the name is valid */
  isValid: boolean;
  /** Normalized version of the name (if valid) */
  normalized?: string;
  /** Error details (if invalid) */
  error?: AbstractNamesError;
}

export interface UseValidateNameResult {
  /** Validation result */
  data: ValidateNameResult | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Structured error with user-friendly message */
  error: AbstractNamesError | null;
  /** Raw error from wagmi (for debugging) */
  rawError: Error | null;
  /** Refetch function */
  refetch: () => void;
}

/**
 * Hook to validate a name using the contract validator
 *
 * Checks if a name meets length and character requirements.
 * Uses contract validation as source of truth - supports 95% of world languages.
 *
 * Automatically uses the active chain from wagmi, or the chain specified in AbstractNamesProvider.
 *
 * @example
 * ```tsx
 * const { data: validation } = useValidateName({
 *   name: 'vitalik'
 * });
 *
 * if (validation?.isValid) {
 *   console.log('Normalized:', validation.normalized);
 * } else {
 *   console.error('Invalid:', validation?.error?.userMessage);
 * }
 * ```
 */
export function useValidateName({
  name,
  enabled = true,
}: UseValidateNameParams): UseValidateNameResult {
  const wagmiChainId = useChainId();
  const context = useAbstractNamesContext();
  const chainId = context?.chainId ?? wagmiChainId;
  const config = getConfigForChainId(chainId);

  // Memoize input to prevent infinite loops in query dependencies
  const normalizedInput = useMemo(
    () => name?.toLowerCase().replace(/\.abs$/, ''),
    [name]
  );

  const {
    data: normalized,
    error: rawError,
    isLoading,
    refetch,
  } = useReadContract({
    address: config?.validatorAddress,
    abi: validatorAbi,
    functionName: 'validateName',
    args: normalizedInput ? [normalizedInput] : undefined,
    query: {
      enabled: enabled && !!normalizedInput && !!config,
    },
  });

  // React 19 compiler optimizes conditional object construction
  const result = normalized
    ? { isValid: true, normalized }
    : rawError
      ? {
          isValid: false,
          error: parseContractError(rawError as Error) || undefined,
        }
      : undefined;

  return {
    data: result,
    isLoading,
    error: parseContractError(rawError as Error | null),
    rawError: rawError as Error | null,
    refetch,
  };
}
