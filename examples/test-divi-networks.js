/**
 * Test DIVI Network Configurations
 * Run with: node examples/test-divi-networks.js
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const networks = require('../src/cjs/networks.cjs');
const { divi, diviTestnet } = networks;

console.log('=== DIVI Network Configurations ===\n');

console.log('DIVI Mainnet:');
console.log('  Message Prefix:', divi.messagePrefix);
console.log('  Bech32:', divi.bech32);
console.log('  PubKeyHash:', '0x' + divi.pubKeyHash.toString(16), '(addresses start with D)');
console.log('  ScriptHash:', '0x' + divi.scriptHash.toString(16), '(addresses start with 3)');
console.log('  WIF:', '0x' + divi.wif.toString(16), '(WIFs start with Y)');
console.log('  BIP32 Public:', '0x' + divi.bip32.public.toString(16));
console.log('  BIP32 Private:', '0x' + divi.bip32.private.toString(16));

console.log('\nDIVI Testnet:');
console.log('  Message Prefix:', diviTestnet.messagePrefix);
console.log('  Bech32:', diviTestnet.bech32);
console.log('  PubKeyHash:', '0x' + diviTestnet.pubKeyHash.toString(16));
console.log('  ScriptHash:', '0x' + diviTestnet.scriptHash.toString(16));
console.log('  WIF:', '0x' + diviTestnet.wif.toString(16));
console.log('  BIP32 Public:', '0x' + diviTestnet.bip32.public.toString(16));
console.log('  BIP32 Private:', '0x' + diviTestnet.bip32.private.toString(16));

console.log('\n✅ DIVI networks loaded successfully!');
