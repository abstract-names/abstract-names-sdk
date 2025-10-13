# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
