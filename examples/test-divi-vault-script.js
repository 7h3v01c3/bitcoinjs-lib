/**
 * Test DIVI Vault Script Creation
 * Run with: node examples/test-divi-vault-script.js
 * 
 * This demonstrates how to create a DIVI vault script using OP_REQUIRE_COINSTAKE
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ops = require('../src/cjs/ops.cjs');
const cryptoModule = require('../src/cjs/crypto.cjs');
const scriptModule = require('../src/cjs/script.cjs');
const { OPS } = ops;
const { hash160 } = cryptoModule;
const { compile, decompile } = scriptModule;

console.log('=== DIVI Vault Script Example ===\n');

// Example: Create a vault script
// Format: OP_IF → owner_pubkey_hash → OP_ELSE → OP_REQUIRE_COINSTAKE → manager_pubkey → OP_ENDIF → OP_OVER → OP_HASH160 → OP_EQUALVERIFY → OP_CHECKSIG

// Mock owner public key (in real usage, this would come from a keypair)
const ownerPubKey = new Uint8Array([
  0x02, 0x79, 0xbe, 0x66, 0x7e, 0xf9, 0xdc, 0xbb, 0xac, 0x55, 0xa0, 0x62, 0x95, 0xce, 0x87, 0x0b,
  0x07, 0x02, 0x9b, 0xfc, 0xdb, 0x2d, 0xce, 0x28, 0xd9, 0x59, 0xf2, 0x81, 0x5b, 0x16, 0xf8, 0x17, 0x98
]);

// Mock manager public key hash (20 bytes, typically extracted from address)
const managerPubKeyHash = new Uint8Array([
  0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0, 0x12, 0x34,
  0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0, 0x12, 0x34, 0x56, 0x78
]);

// Hash owner public key
const ownerPubKeyHash = hash160(ownerPubKey);

console.log('Owner PubKey Hash:', Buffer.from(ownerPubKeyHash).toString('hex'));
console.log('Manager PubKey Hash:', Buffer.from(managerPubKeyHash).toString('hex'));

// Build vault script
const vaultScript = compile([
  OPS.OP_IF,
  ownerPubKeyHash,
  OPS.OP_ELSE,
  OPS.OP_REQUIRE_COINSTAKE,
  managerPubKeyHash,
  OPS.OP_ENDIF,
  OPS.OP_OVER,
  OPS.OP_HASH160,
  OPS.OP_EQUALVERIFY,
  OPS.OP_CHECKSIG
]);

console.log('\nVault Script (hex):', Buffer.from(vaultScript).toString('hex'));

// Decompile to verify
const decompiled = decompile(vaultScript);
console.log('\nDecompiled Script:');
console.log('  Length:', decompiled.length, 'chunks');
console.log('  First opcode:', OPS[decompiled[0]]);
console.log('  OP_REQUIRE_COINSTAKE present:', decompiled.includes(OPS.OP_REQUIRE_COINSTAKE));

console.log('\n✅ DIVI vault script created successfully!');
console.log('\nNote: This is a demonstration. In production, use proper key management.');
