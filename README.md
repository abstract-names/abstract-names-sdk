# Abstract Names SDK

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

Make sure you have wagmi configured in your application. See [wagmi documentation](https://wagmi.sh/react/getting-started) for setup instructions.

## Features

- ✅ **Minimal & Clean** - Only 3 hooks covering essential use cases
- ✅ **TypeScript First** - Full type safety with TypeScript
- ✅ **wagmi Integration** - Built on top of wagmi for optimal React integration
- ✅ **Tree Shakeable** - Import only what you need
- ✅ **Zero Config** - Works out of the box with sensible defaults

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

## API Reference

### `useResolve`

Resolve an Abstract Name to an address.

```tsx
const { data, isLoading, error, refetch } = useResolve({
  name: 'vitalik.abs',
  config: abstractTestnetConfig,
  enabled: true // optional
});
```

**Parameters:**
- `name` - The name to resolve (with or without `.abs` suffix)
- `config` - Contract configuration (addresses and chain ID)
- `enabled` - Optional boolean to enable/disable the query

**Returns:**
- `data` - Resolved address or `undefined`
- `isLoading` - Loading state
- `error` - Error object if query failed
- `refetch` - Function to manually refetch

### `useReverseResolve`

Get the primary name for an address.

```tsx
const { data, isLoading, error, refetch } = useReverseResolve({
  address: '0x1234...',
  config: abstractTestnetConfig,
  enabled: true // optional
});
```

**Parameters:**
- `address` - The address to reverse resolve
- `config` - Contract configuration
- `enabled` - Optional boolean to enable/disable the query

**Returns:**
- `data` - Primary name with `.abs` suffix or `undefined`
- `isLoading` - Loading state
- `error` - Error object if query failed
- `refetch` - Function to manually refetch

### `useProfile`

Get complete profile data for a name or address.

```tsx
const { data, isLoading, error, refetch, getTextRecord } = useProfile({
  nameOrAddress: 'vitalik.abs', // or '0x1234...'
  config: abstractTestnetConfig,
  enabled: true // optional
});
```

**Parameters:**
- `nameOrAddress` - Name (e.g., "vitalik.abs") or address to get profile for
  - If address is provided, fetches primary name profile
  - If name is provided, fetches profile for that name
- `config` - Contract configuration
- `enabled` - Optional boolean to enable/disable the query

**Returns:**
- `data` - `NameProfile` object with all profile data
- `isLoading` - Loading state
- `error` - Error object if query failed
- `refetch` - Function to manually refetch
- `getTextRecord(key)` - Helper function to get a specific text record

**NameProfile type:**
```typescript
interface NameProfile {
  name: string;              // Full name with TLD (e.g., "vitalik.abs")
  resolvedAddress: Address;  // Address the name resolves to
  keys: string[];            // Text record keys
  values: string[];          // Text record values
  contenthash: `0x${string}`; // Content hash
}
```

## Configuration

### Pre-configured Networks

```tsx
import { abstractTestnetConfig, abstractMainnetConfig } from '@abstract-names/sdk';

// Abstract Testnet (Chain ID: 11124)
const config = abstractTestnetConfig;

// Abstract Mainnet (Chain ID: 2741)
const config = abstractMainnetConfig;
```

### Custom Configuration

```tsx
import { createConfig } from '@abstract-names/sdk';

const customConfig = createConfig(
  '0xRegistryAddress',
  '0xResolverAddress',
  11124 // chain ID
);
```

### Get Config by Chain ID

```tsx
import { getConfig } from '@abstract-names/sdk';

const config = getConfig(11124); // Returns abstractTestnetConfig
```

## Supported Text Records

The SDK supports the following text record keys:
- `avatar` - Avatar image URL
- `description` - Profile description
- `com.x` - X (Twitter) handle
- `com.discord` - Discord username
- `com.telegram` - Telegram username
- `com.github` - GitHub username
- `url` - Personal website URL
- `header` - Header/banner image URL

```tsx
const { data: profile, getTextRecord } = useProfile({
  nameOrAddress: 'vitalik.abs',
  config: abstractTestnetConfig
});

const avatar = getTextRecord('avatar');
const twitter = getTextRecord('com.x');
const github = getTextRecord('com.github');
```

## Advanced Usage

### Conditional Queries

```tsx
const [name, setName] = useState('');

const { data: address } = useResolve({
  name,
  config: abstractTestnetConfig,
  enabled: name.length > 0 // Only query when name is not empty
});
```

### Manual Refetch

```tsx
const { data, refetch } = useResolve({
  name: 'vitalik.abs',
  config: abstractTestnetConfig
});

// Refetch when needed
const handleRefresh = () => {
  refetch();
};
```

### Using with wagmi's useAccount

```tsx
import { useAccount } from 'wagmi';
import { useReverseResolve } from '@abstract-names/sdk';

function UserProfile() {
  const { address } = useAccount();

  const { data: name } = useReverseResolve({
    address,
    config: abstractTestnetConfig
  });

  return <div>Your name: {name || 'No primary name set'}</div>;
}
```

## Examples

### Display User's Primary Name

```tsx
import { useAccount } from 'wagmi';
import { useProfile, abstractTestnetConfig } from '@abstract-names/sdk';

function UserCard() {
  const { address } = useAccount();

  const { data: profile, isLoading } = useProfile({
    nameOrAddress: address,
    config: abstractTestnetConfig
  });

  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div>
      <h2>{profile.name}</h2>
      <p>{profile.resolvedAddress}</p>
    </div>
  );
}
```

### Name Search Component

```tsx
import { useState } from 'react';
import { useResolve, abstractTestnetConfig } from '@abstract-names/sdk';

function NameSearch() {
  const [searchName, setSearchName] = useState('');

  const { data: address, isLoading } = useResolve({
    name: searchName,
    config: abstractTestnetConfig,
    enabled: searchName.length > 2
  });

  return (
    <div>
      <input
        type="text"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        placeholder="Search name..."
      />
      {isLoading && <p>Loading...</p>}
      {address && <p>Resolves to: {address}</p>}
    </div>
  );
}
```

### Profile Display with Social Links

```tsx
import { useProfile, abstractTestnetConfig } from '@abstract-names/sdk';

function ProfileCard({ name }: { name: string }) {
  const { data: profile, getTextRecord } = useProfile({
    nameOrAddress: name,
    config: abstractTestnetConfig
  });

  if (!profile) return null;

  const avatar = getTextRecord('avatar');
  const twitter = getTextRecord('com.x');
  const github = getTextRecord('com.github');
  const description = getTextRecord('description');

  return (
    <div>
      {avatar && <img src={avatar} alt={profile.name} />}
      <h2>{profile.name}</h2>
      {description && <p>{description}</p>}
      <div>
        {twitter && <a href={`https://x.com/${twitter}`}>Twitter</a>}
        {github && <a href={`https://github.com/${github}`}>GitHub</a>}
      </div>
    </div>
  );
}
```

## TypeScript

The SDK is written in TypeScript and provides complete type definitions. All hooks and types are fully typed.

```typescript
import type {
  AbstractNamesConfig,
  NameProfile,
  TextRecordKey,
  UseResolveResult
} from '@abstract-names/sdk';
```

## Development

### Building the SDK

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Development mode (watch)
pnpm dev

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format
pnpm format
```

## Publishing

Before publishing, make sure to:

1. Update contract addresses in `src/config.ts` after deployment
2. Update version in `package.json`
3. Build the package: `npm run build`
4. Publish to npm: `npm publish`

## Package Management Guide

### First Time Setup

1. **Build the package:**
   ```bash
   cd sdk
   pnpm install
   pnpm build
   ```

2. **Publish to npm:**
   ```bash
   npm login
   npm publish --access public
   ```

### Updating the Package

1. **Make your changes** to the source code
2. **Update version** in `package.json` following [semver](https://semver.org/):
   - Patch release (bug fixes): `0.1.0` → `0.1.1`
   - Minor release (new features): `0.1.0` → `0.2.0`
   - Major release (breaking changes): `0.1.0` → `1.0.0`
3. **Build and publish:**
   ```bash
   pnpm build
   npm publish
   ```

### Local Development

To test the SDK locally in your app before publishing:

```bash
# In sdk directory
pnpm link --global

# In your app directory
pnpm link --global @abstract-names/sdk
```

## Contract Addresses

After deploying your contracts, update the addresses in `src/config.ts`:

```typescript
export const abstractTestnetConfig: AbstractNamesConfig = {
  registryAddress: '0xYourRegistryAddress',
  resolverAddress: '0xYourResolverAddress',
  chainId: 11124,
};
```

## License

MIT

## Support

For issues and questions:
- GitHub Issues: [your-repo-url]
- Documentation: [your-docs-url]
