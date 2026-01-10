/**
 * Comprehensive DIVI Key Derivation Example
 * 
 * This demonstrates the complete flow:
 * 1. Generate 12-word mnemonic seed
 * 2. Convert mnemonic to seed
 * 3. Create BIP32 root from seed
 * 4. Derive keys using BIP44 paths
 * 5. Generate private keys, public keys, WIFs, and addresses
 * 
 * Run with: node examples/test-divi-key-derivation.js
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import required libraries
const bip39 = require('bip39');
const BIP32Factory = require('bip32').default || require('bip32');
const ecc = require('tiny-secp256k1');
const { divi, diviTestnet } = require('../src/cjs/networks.cjs');
const paymentsModule = require('../src/cjs/payments/index.cjs');
const addressModule = require('../src/cjs/address.cjs');
const cryptoModule = require('../src/cjs/crypto.cjs');

const bip32 = BIP32Factory(ecc);
const { p2pkh } = paymentsModule;
const { toBase58Check } = addressModule;
const { hash160 } = cryptoModule;

console.log('=== DIVI Key Derivation - Complete Flow ===\n');

// ============================================================================
// STEP 1: Generate 12-word Mnemonic
// ============================================================================
console.log('STEP 1: Generate 12-word Mnemonic');
console.log('─'.repeat(60));

// Generate a new mnemonic (12 words = 128 bits of entropy)
const mnemonic = bip39.generateMnemonic(128); // 128 bits = 12 words
console.log('Mnemonic (12 words):', mnemonic);
console.log('Word count:', mnemonic.split(' ').length);
console.log('Valid mnemonic:', bip39.validateMnemonic(mnemonic) ? '✅' : '❌');

// ============================================================================
// STEP 2: Convert Mnemonic to Seed
// ============================================================================
console.log('\nSTEP 2: Convert Mnemonic to Seed');
console.log('─'.repeat(60));

// Convert mnemonic to seed (no passphrase for this example)
const seed = bip39.mnemonicToSeedSync(mnemonic);
console.log('Seed (hex):', Buffer.from(seed).toString('hex'));
console.log('Seed length:', seed.length, 'bytes (512 bits)');

// With passphrase (optional - shown for completeness)
const passphrase = ''; // Empty passphrase
const seedWithPassphrase = bip39.mnemonicToSeedSync(mnemonic, passphrase);
console.log('Seed with passphrase (hex):', Buffer.from(seedWithPassphrase).toString('hex'));

// ============================================================================
// STEP 3: Create BIP32 Root Node
// ============================================================================
console.log('\nSTEP 3: Create BIP32 Root Node from Seed');
console.log('─'.repeat(60));

const root = bip32.fromSeed(seed);

// Extended Private Key (xpriv)
const xpriv = root.toBase58();
console.log('Extended Private Key (xpriv):', xpriv);
console.log('  Length:', xpriv.length, 'characters');

// Extended Public Key (xpub) - neutered (no private key info)
const xpub = root.neutered().toBase58();
console.log('Extended Public Key (xpub):', xpub);
console.log('  Length:', xpub.length, 'characters');
console.log('  Note: xpub can derive public keys without exposing private keys');

// ============================================================================
// STEP 4: Derive Keys Using BIP44 Path
// ============================================================================
console.log('\nSTEP 4: Derive Keys Using BIP44 Path');
console.log('─'.repeat(60));
console.log('BIP44 Path Format: m/purpose\'/coin_type\'/account\'/change/address_index');
console.log('DIVI Coin Type: 301 (or use 0 for Bitcoin-compatible)');
console.log('');

// BIP44 paths for DIVI
// m/44'/301'/0'/0/0 - First receiving address (account 0, external chain, index 0)
// m/44'/301'/0'/0/1 - Second receiving address
// m/44'/301'/0'/1/0 - First change address (change chain, index 0)

// For DIVI, we'll use coin type 301 (DIVI's registered coin type)
// If 301 doesn't work, we can use 0 for Bitcoin-compatible paths
const coinType = 301; // DIVI coin type

const paths = [
  { path: `m/44'/${coinType}'/0'/0/0`, label: 'First Receiving Address (Account 0, External, Index 0)' },
  { path: `m/44'/${coinType}'/0'/0/1`, label: 'Second Receiving Address (Account 0, External, Index 1)' },
  { path: `m/44'/${coinType}'/0'/0/2`, label: 'Third Receiving Address (Account 0, External, Index 2)' },
  { path: `m/44'/${coinType}'/0'/1/0`, label: 'First Change Address (Account 0, Change, Index 0)' },
  { path: `m/44'/${coinType}'/0'/1/1`, label: 'Second Change Address (Account 0, Change, Index 1)' },
  { path: `m/44'/${coinType}'/1'/0/0`, label: 'Account 1, First Receiving Address' },
];

// Also show non-BIP44 paths for comparison
const legacyPaths = [
  { path: "m/0'/0/0", label: 'Legacy Path (Account 0, External, Index 0)' },
  { path: "m/0'/0/1", label: 'Legacy Path (Account 0, External, Index 1)' },
  { path: "m/0'/1/0", label: 'Legacy Path (Account 0, Change, Index 0)' },
];

console.log('Deriving keys for DIVI Mainnet:\n');

// ============================================================================
// STEP 5: Derive and Display Keys for Each Path
// ============================================================================
function deriveAndDisplayKeys(root, path, label, network) {
  try {
    const child = root.derivePath(path);
    
    // Private Key (32 bytes)
    const privateKey = child.privateKey;
    const privateKeyHex = Buffer.from(privateKey).toString('hex');
    
    // Public Key (33 bytes compressed)
    const publicKey = child.publicKey;
    const publicKeyHex = Buffer.from(publicKey).toString('hex');
    
    // Public Key Hash (20 bytes) - used for P2PKH addresses
    const pubKeyHash = hash160(publicKey);
    const pubKeyHashHex = Buffer.from(pubKeyHash).toString('hex');
    
    // WIF (Wallet Import Format)
    const wif = child.toWIF(network);
    
    // P2PKH Address (DIVI mainnet starts with 'D')
    const p2pkhAddress = toBase58Check(pubKeyHash, network.pubKeyHash);
    
    // Also create using payments API for verification
    const p2pkhPayment = p2pkh({
      pubkey: publicKey,
      network: network
    });
    
    console.log(`  Path: ${path}`);
    console.log(`  Label: ${label}`);
    console.log(`  Private Key (hex): ${privateKeyHex}`);
    console.log(`  Private Key (bytes): ${privateKey.length} bytes`);
    console.log(`  Public Key (hex): ${publicKeyHex}`);
    console.log(`  Public Key (bytes): ${publicKey.length} bytes (compressed)`);
    console.log(`  Public Key Hash (hex): ${pubKeyHashHex}`);
    console.log(`  WIF: ${wif}`);
    console.log(`  P2PKH Address: ${p2pkhAddress}`);
    console.log(`  P2PKH Address (via payments): ${p2pkhPayment.address}`);
    console.log(`  Addresses match: ${p2pkhAddress === p2pkhPayment.address ? '✅' : '❌'}`);
    console.log('');
    
    return {
      path,
      label,
      privateKey: privateKeyHex,
      publicKey: publicKeyHex,
      pubKeyHash: pubKeyHashHex,
      wif,
      address: p2pkhAddress
    };
  } catch (error) {
    console.log(`  Path: ${path}`);
    console.log(`  Label: ${label}`);
    console.log(`  ❌ Error: ${error.message}`);
    console.log('');
    return null;
  }
}

// Derive keys for BIP44 paths
console.log('BIP44 Paths (m/44\'/301\'/...):');
console.log('='.repeat(60));
const derivedKeys = [];

for (const pathInfo of paths) {
  const result = deriveAndDisplayKeys(root, pathInfo.path, pathInfo.label, divi);
  if (result) derivedKeys.push(result);
}

// Derive keys for legacy paths
console.log('\nLegacy Paths (m/0\'/...):');
console.log('='.repeat(60));
for (const pathInfo of legacyPaths) {
  const result = deriveAndDisplayKeys(root, pathInfo.path, pathInfo.label, divi);
  if (result) derivedKeys.push(result);
}

// ============================================================================
// STEP 6: Testnet Keys
// ============================================================================
console.log('\nSTEP 6: Testnet Key Derivation');
console.log('─'.repeat(60));
console.log('Deriving first testnet address:\n');

const testnetPath = `m/44'/${coinType}'/0'/0/0`;
const testnetResult = deriveAndDisplayKeys(root, testnetPath, 'DIVI Testnet - First Receiving Address', diviTestnet);

// ============================================================================
// STEP 7: Key Variations and Formats
// ============================================================================
console.log('\nSTEP 7: Key Format Variations');
console.log('─'.repeat(60));

if (derivedKeys.length > 0) {
  const firstKey = derivedKeys[0];
  const firstNode = root.derivePath(firstKey.path);
  
  console.log('For the first derived key:');
  console.log(`  Path: ${firstKey.path}`);
  console.log(`  Address: ${firstKey.address}`);
  console.log('');
  
  // Show different key representations
  console.log('Private Key Representations:');
  console.log(`  Hex: ${firstKey.privateKey}`);
  console.log(`  WIF: ${firstKey.wif}`);
  console.log(`  Extended Private Key (xpriv): ${firstNode.toBase58()}`);
  console.log('');
  
  console.log('Public Key Representations:');
  console.log(`  Hex (compressed): ${firstKey.publicKey}`);
  console.log(`  Extended Public Key (xpub): ${firstNode.neutered().toBase58()}`);
  console.log(`  Public Key Hash: ${firstKey.pubKeyHash}`);
  console.log('');
  
  // Show address formats
  console.log('Address Formats:');
  console.log(`  P2PKH (Legacy): ${firstKey.address}`);
  console.log(`  Network: ${divi.pubKeyHash === 0x1e ? 'DIVI Mainnet' : 'Unknown'}`);
  console.log(`  Address starts with: ${firstKey.address[0]}`);
}

// ============================================================================
// STEP 8: Summary
// ============================================================================
console.log('\nSTEP 8: Summary');
console.log('─'.repeat(60));
console.log(`✅ Generated 12-word mnemonic: ${mnemonic.split(' ').length} words`);
console.log(`✅ Created seed: ${seed.length} bytes`);
console.log(`✅ Generated BIP32 root node`);
console.log(`✅ Derived ${derivedKeys.length} key pairs`);
console.log(`✅ Generated ${derivedKeys.length} DIVI addresses`);
console.log('');
console.log('Key Derivation Complete!');
console.log('');
console.log('⚠️  SECURITY WARNINGS:');
console.log('  - Never share your mnemonic or private keys');
console.log('  - Store your mnemonic securely offline');
console.log('  - Use hardware wallets for production');
console.log('  - Test addresses on testnet before using mainnet');
console.log('  - DIVI uses legacy addresses only (no SegWit/Bech32)');
