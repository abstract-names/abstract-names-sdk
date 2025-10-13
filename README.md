# Abstract Names SDK

[![npm version](https://badge.fury.io/js/@abstract-names%2Fsdk.svg)](https://www.npmjs.com/package/@abstract-names/sdk)
[![npm downloads](https://img.shields.io/npm/dm/@abstract-names/sdk.svg)](https://www.npmjs.com/package/@abstract-names/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

React SDK for interacting with Abstract Names contracts. Provides simple hooks for name resolution, reverse resolution, and profile data.

## Installation

```bash
# npm
npm install @abstract-names/sdk

# yarn
yarn add @abstract-names/sdk

# pnpm
pnpm add @abstract-names/sdk

# bun
bun add @abstract-names/sdk
```

## Prerequisites

This SDK requires the following peer dependencies:
- `react` (^18.0.0 or ^19.0.0)
- `wagmi` (^2.0.0)
- `viem` (^2.0.0)

Make sure you have wagmi configured in your application.

## Quick Start

```tsx
import { useResolve, useReverseResolve, useProfile, abstractTestnetConfig } from '@abstract-names/sdk';

function MyComponent() {
  // Resolve name to address
  const { data: address } = useResolve({
    name: 'vitalik.abs',
    config: abstractTestnetConfig
  });

  // Reverse resolve address to name
  const { data: name } = useReverseResolve({
    address: '0x1234...',
    config: abstractTestnetConfig
  });

  // Get complete profile
  const { data: profile, getTextRecord } = useProfile({
    nameOrAddress: 'vitalik.abs',
    config: abstractTestnetConfig
  });

  const twitter = getTextRecord('com.x');

  return (
    <div>
      <p>Address: {address}</p>
      <p>Name: {name}</p>
      <p>Twitter: {twitter}</p>
    </div>
  );
}
```

## Features

- ✅ **Minimal & Clean** - 7 focused hooks covering essential use cases
- ✅ **TypeScript First** - Full type safety with TypeScript
- ✅ **wagmi Integration** - Built on top of wagmi for optimal React integration
- ✅ **Tree Shakeable** - Import only what you need

## Available Hooks

**Resolution:**
- `useResolve` - Resolve name to address
- `useReverseResolve` - Get primary name for address
- `useProfile` - Get complete profile data including text records

**Utilities:**
- `useNameAvailability` - Check if a name is available for registration
- `useNameExpiry` - Get expiration info with days until expiry
- `useTextRecord` - Fetch individual text records
- `useAllowedTextKeys` - Get supported text record keys

## Configuration

```tsx
import { abstractTestnetConfig, abstractMainnetConfig } from '@abstract-names/sdk';

// Abstract Testnet
const config = abstractTestnetConfig;

// Abstract Mainnet
const config = abstractMainnetConfig;
```

## Documentation

For complete documentation, examples, and guides:

📖 **General Documentation:** https://abstractnames.gitbook.io/docs

🎣 **React Hooks Guide:** https://abstractnames.gitbook.io/docs/documentation/build/react

## License

MIT
