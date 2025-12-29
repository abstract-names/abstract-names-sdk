import { useChainId, useReadContract } from 'wagmi';
import { controllerAbi } from '../abis/controller';
import { getConfigForChainId } from '../config';
import type { AbstractNamesError } from '../errors';
import { parseContractError } from '../errors';
import { useAbstractNamesContext } from '../provider';

/**
 * Mint phase enumeration
 * Matches the Phase enum in AbstractNamesController contract
 */
export enum Phase {
  NONE = 0,
  WHITELIST = 1,
  WAITLIST = 2,
  PUBLIC = 3,
}

export interface MintPhaseData {
  /** Current phase value */
  phase: Phase;
  /** Human-readable phase name */
  phaseName: string;
  /** Whether minting is currently closed */
  isClosed: boolean;
}

export interface UseMintPhaseParams {
  /** Enable/disable the query */
  enabled?: boolean;
}

export interface UseMintPhaseResult {
  /** Current mint phase data */
  data: MintPhaseData | undefined;
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
 * Hook to get the current mint phase
 *
 * The controller uses a three-phase launch system:
 * - NONE (0): Minting not started
 * - WHITELIST (1): Only whitelisted addresses can mint
 * - WAITLIST (2): Waitlisted addresses can mint
 * - PUBLIC (3): Anyone can mint
 *
 * Automatically uses the active chain from wagmi, or the chain specified in AbstractNamesProvider.
 *
 * @example
 * ```tsx
 * const { data: phaseData } = useMintPhase();
 *
 * if (phaseData?.phase === Phase.PUBLIC) {
 *   console.log('Public minting is open!');
 * } else if (phaseData?.isClosed) {
 *   console.log('Minting has not started yet');
 * }
 * ```
 */
export function useMintPhase({
  enabled = true,
}: UseMintPhaseParams = {}): UseMintPhaseResult {
  const wagmiChainId = useChainId();
  const context = useAbstractNamesContext();
  const chainId = context?.chainId ?? wagmiChainId;
  const config = getConfigForChainId(chainId);

  const {
    data: phaseValue,
    error: rawError,
    isLoading,
    refetch,
  } = useReadContract({
    address: config?.controllerAddress,
    abi: controllerAbi,
    functionName: 'getCurrentPhase',
    query: {
      enabled: enabled && !!config,
    },
  });

  // React 19 compiler optimizes simple transformations
  const result =
    phaseValue !== undefined
      ? {
          phase: phaseValue as Phase,
          phaseName: ['Not Started', 'Whitelist', 'Waitlist', 'Public'][
            phaseValue
          ],
          isClosed: phaseValue === Phase.NONE,
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
