import { useState, useEffect } from 'react';
import { useValidateName } from './useValidateName';
import type { UseValidateNameResult } from './useValidateName';

export interface UseValidateNameDebouncedParams {
  /** Name to validate (e.g., "vitalik" or "vitalik.abs") */
  name?: string;
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
  /** Enable/disable the query */
  enabled?: boolean;
}

/**
 * Hook to validate a name with debouncing for real-time input
 *
 * Delays validation until the user stops typing.
 * Perfect for search boxes and registration forms with live validation.
 *
 * Automatically uses the active chain from wagmi, or the chain specified in AbstractNamesProvider.
 *
 * @example
 * ```tsx
 * const [name, setName] = useState('');
 * const { data: validation, isLoading } = useValidateNameDebounced({
 *   name,
 *   debounceMs: 300
 * });
 *
 * return (
 *   <div>
 *     <input value={name} onChange={(e) => setName(e.target.value)} />
 *     {isLoading && <span>Checking...</span>}
 *     {validation?.isValid && <span>✓ Available</span>}
 *     {validation?.error && <span>{validation.error.userMessage}</span>}
 *   </div>
 * );
 * ```
 */
export function useValidateNameDebounced({
  name,
  debounceMs = 300,
  enabled = true,
}: UseValidateNameDebouncedParams): UseValidateNameResult {
  const [debouncedName, setDebouncedName] = useState(name);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(name);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [name, debounceMs]);

  return useValidateName({
    name: debouncedName,
    enabled,
  });
}
