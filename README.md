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
import { useResolve, useReverseResolve, useProfile } from '@abstract-names/sdk';

function MyComponent() {
  // Resolve name to address
  const { data: address } = useResolve({
    name: 'vitalik.abs'
  });

  // Reverse resolve address to name
  const { data: name } = useReverseResolve({
    address: '0x1234...'
  });

  // Get complete profile
  const { data: profile, getTextRecord } = useProfile({
    nameOrAddress: 'vitalik.abs'
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

- ✅ **Auto-Detection** - Automatically uses the active chain from wagmi
- ✅ **Minimal & Clean** - 7 focused hooks covering essential use cases
- ✅ **TypeScript First** - Full type safety with TypeScript
- ✅ **wagmi Integration** - Built on top of wagmi for optimal React integration
- ✅ **Tree Shakeable** - Import only what you need
- ✅ **Works with Any Wallet** - Compatible with RainbowKit, Privy, Dynamic, WalletConnect, or native implementations

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

## How It Works

### Automatic Chain Detection

The SDK automatically detects the active chain from wagmi - no need to pass chain parameters to each hook:

```tsx
// Example with AbstractWalletProvider
import { AbstractWalletProvider } from "@abstract-foundation/agw-react";
import { abstractTestnet } from "viem/chains";

function App() {
  return (
    <AbstractWalletProvider chain={abstractTestnet}>
      <YourApp />
    </AbstractWalletProvider>
  );
}

// In your components - no chain parameter needed!
import { useResolve } from "@abstract-names/sdk";

function YourComponent() {
  const { data } = useResolve({
    name: "vitalik.abs"
  });
  // Auto-detects abstractTestnet from wagmi
}
```

Works with RainbowKit, Privy, Dynamic, or any wagmi setup - the SDK automatically uses your active chain!

### Optional: Override Chain with Provider

Need to query a different chain than the active one? Use the `AbstractNamesProvider`:

```tsx
import { AbstractNamesProvider } from "@abstract-names/sdk";
import { abstractTestnet } from "viem/chains";

function App() {
  return (
    <AbstractNamesProvider chainId={abstractTestnet.id}>
      <YourApp />
      {/* All hooks inside will use abstractTestnet */}
    </AbstractNamesProvider>
  );
}
```

## Documentation

For complete documentation, examples, and guides:

📖 **General Documentation:** https://abstractnames.gitbook.io/docs

🎣 **React Hooks Guide:** https://abstractnames.gitbook.io/docs/documentation/build/react

## License

MIT
