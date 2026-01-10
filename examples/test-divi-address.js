/**
 * Test DIVI Address Generation
 * Run with: node examples/test-divi-address.js
 * 
 * This demonstrates DIVI address creation using the DIVI network
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const networks = require('../src/cjs/networks.cjs');
const addressModule = require('../src/cjs/address.cjs');
const { divi, diviTestnet } = networks;
const { toBase58Check, fromBase58Check } = addressModule;

console.log('=== DIVI Address Generation Example ===\n');

// Mock public key hash (20 bytes)
// In real usage, this would come from: crypto.hash160(publicKey)
const pubKeyHash = new Uint8Array([
  0x79, 0xbe, 0x66, 0x7e, 0xf9, 0xdc, 0xbb, 0xac, 0x55, 0xa0,
  0x62, 0x95, 0xce, 0x87, 0x0b, 0x07, 0x02, 0x9b, 0xfc, 0xdb
]);

console.log('Public Key Hash:', Buffer.from(pubKeyHash).toString('hex'));

try {
  // Generate DIVI mainnet address (P2PKH - starts with 'D')
  const diviAddress = toBase58Check(pubKeyHash, divi.pubKeyHash);
  console.log('\nDIVI Mainnet Address:', diviAddress);
  console.log('  Network:', 'mainnet');
  console.log('  Type:', 'P2PKH (starts with D)');
  console.log('  PubKeyHash prefix:', '0x' + divi.pubKeyHash.toString(16));

  // Generate DIVI testnet address
  const diviTestnetAddress = toBase58Check(pubKeyHash, diviTestnet.pubKeyHash);
  console.log('\nDIVI Testnet Address:', diviTestnetAddress);
  console.log('  Network:', 'testnet');
  console.log('  Type:', 'P2PKH');
  console.log('  PubKeyHash prefix:', '0x' + diviTestnet.pubKeyHash.toString(16));

  // Verify addresses can be decoded
  const decodedMainnet = fromBase58Check(diviAddress);
  const decodedTestnet = fromBase58Check(diviTestnetAddress);

  console.log('\n=== Address Verification ===');
  console.log('Mainnet decoded prefix:', '0x' + decodedMainnet.version.toString(16));
  console.log('Testnet decoded prefix:', '0x' + decodedTestnet.version.toString(16));
  console.log('Prefixes match network config:', 
    decodedMainnet.version === divi.pubKeyHash && 
    decodedTestnet.version === diviTestnet.pubKeyHash ? '✅' : '❌');

  console.log('\n✅ DIVI address generation working correctly!');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
