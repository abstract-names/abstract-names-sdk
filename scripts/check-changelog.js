#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the new version from package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);
const currentVersion = packageJson.version;

// Read CHANGELOG.md
const changelogPath = path.join(__dirname, '../CHANGELOG.md');
const changelog = fs.readFileSync(changelogPath, 'utf8');

// Check if the current version exists in the changelog
const versionPattern = new RegExp(`\\[${currentVersion}\\]`, 'i');

if (!versionPattern.test(changelog)) {
  console.error('\n❌ CHANGELOG.md does not contain an entry for version', currentVersion);
  console.error('\nPlease add a changelog entry like:\n');
  console.error(`## [${currentVersion}] - ${new Date().toISOString().split('T')[0]}\n`);
  console.error('### Added');
  console.error('- New feature description\n');
  console.error('### Changed');
  console.error('- Changed feature description\n');
  console.error('### Fixed');
  console.error('- Bug fix description\n');
  process.exit(1);
}

console.log('✅ CHANGELOG.md contains entry for version', currentVersion);
