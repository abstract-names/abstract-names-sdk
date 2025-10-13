import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

interface AbstractNamesContextValue {
  /** Optional chain ID override */
  chainId?: number;
}

const AbstractNamesContext = createContext<
  AbstractNamesContextValue | undefined
>(undefined);

export interface AbstractNamesProviderProps {
  /** Chain ID to use (overrides wagmi's active chain) */
  chainId?: number;
  children: ReactNode;
}

/**
 * Provider for Abstract Names configuration
 *
 * Optional - hooks will automatically use wagmi's active chain if no provider is present.
 * Use this provider only if you need to override the chain for specific components.
 *
 * @example
 * ```tsx
 * import { AbstractNamesProvider } from '@abstract-names/sdk';
 * import { abstractTestnet } from 'viem/chains';
 *
 * function App() {
 *   return (
 *     <AbstractNamesProvider chainId={abstractTestnet.id}>
 *       <YourApp />
 *     </AbstractNamesProvider>
 *   );
 * }
 * ```
 */
export function AbstractNamesProvider({
  chainId,
  children,
}: AbstractNamesProviderProps) {
  return (
    <AbstractNamesContext.Provider value={{ chainId }}>
      {children}
    </AbstractNamesContext.Provider>
  );
}

/**
 * Hook to access Abstract Names context
 * @internal
 */
export function useAbstractNamesContext():
  | AbstractNamesContextValue
  | undefined {
  return useContext(AbstractNamesContext);
}
