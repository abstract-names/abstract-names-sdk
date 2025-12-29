# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2025-12-29

### Added
- **Structured Error Handling**: All hooks now return `AbstractNamesError` with user-friendly messages
- **Name Validation**: `useValidateName` hook for contract-based validation (supports Unicode)
- **Debounced Validation**: `useValidateNameDebounced` hook reduces RPC calls by ~70%
- **Text Record Writes**: `useSetTextRecord`, `useBatchSetText`, `useSetPrimaryName`, `useSetAddress` hooks
- **Pricing & Phases**: `useNamePrice` and `useMintPhase` hooks for tier pricing and phase detection
- **Controller ABI**: Added controller contract ABI with pricing functions
- **Validator ABI**: Added validator contract ABI with Unicode support
- **Performance**: Added `sideEffects: false` to package.json for tree-shaking
- **Error Types**: 10 categorized error types (VALIDATION_ERROR, UNAUTHORIZED, NAME_EXPIRED, etc.)

### Changed
- **BREAKING**: Hook `error` field changed from `Error | null` to `AbstractNamesError | null`
- All hooks now include `rawError: Error | null` for backward compatibility
- Error messages are now user-friendly (e.g., "Name must be between 3 and 63 characters")
- Expanded Resolver ABI with write functions (setText, batchSetText, setPrimaryName, etc.)

### Migration
Replace `error.message` with `error.userMessage` for user-facing error displays. Use `rawError` for debugging.

## [0.2.1] - 2025-10-13

### Added
- `AbstractNamesProvider` component for optional chain override via React Context
- Auto-detection of active chain from wagmi's `useChainId()` hook

### Changed
- **BREAKING**: All hooks no longer require a `chain` or `config` parameter - they auto-detect the active chain from wagmi
- **BREAKING**: Removed `chainId` field from `AbstractNamesConfig` interface
- **BREAKING**: Renamed `getConfig` to `getConfigForChainId` and it now accepts a `chainId` number
- Hooks now automatically use wagmi's active chain, with optional override via `AbstractNamesProvider`
- `getConfigForChainId` returns `undefined` instead of throwing errors for unsupported chains
- Simplified API - no need to pass chain to every hook call

### Removed
- **BREAKING**: Removed `abstractTestnetConfig` and `abstractMainnetConfig` exports (use auto-detection instead)
- **BREAKING**: Removed `createConfig` function (no longer needed)
- **BREAKING**: Removed `chain` parameter from all hook interfaces

## [0.2.0] - 2024-10-13

### Added
- `useNameAvailability` hook to check if a name is available for registration
- `useNameExpiry` hook to get expiration information including days until expiry
- `useTextRecord` hook for fetching individual text records (more focused than useProfile)
- `useAllowedTextKeys` hook to get the list of supported text record keys
- `NameExpiryData` type for expiry information
- New ABI functions: `isAvailable`, `getText`, `getAllowedTextKeys`

### Changed
- Improved export organization in index.ts for better discoverability
- Enhanced type exports for all new hooks

## [0.1.1] - 2024-10-13

### Changed
- Updated README to be more concise with links to GitBook documentation
- Improved documentation structure

## [0.1.0] - 2024-10-13

### Added
- Initial release of Abstract Names SDK
- `useResolve` hook for name to address resolution
- `useReverseResolve` hook for address to primary name resolution
- `useProfile` hook for complete profile data including text records
- TypeScript support with full type definitions
- Pre-configured settings for Abstract testnet and mainnet
- Support for all major package managers (npm, yarn, pnpm, bun)

### Features
- Built on wagmi v2 and viem v2
- Tree-shakeable ESM and CJS bundles
- Full TypeScript type safety
- Contract ABIs included
- Text record support (avatar, description, social links, etc.)
