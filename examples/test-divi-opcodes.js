/**
 * Test DIVI-Specific Opcodes
 * Run with: node examples/test-divi-opcodes.js
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ops = require('../src/cjs/ops.cjs');
const { OPS } = ops;

console.log('=== DIVI-Specific Opcodes ===\n');

console.log('OP_REQUIRE_COINSTAKE:', OPS.OP_REQUIRE_COINSTAKE, '(0x' + OPS.OP_REQUIRE_COINSTAKE.toString(16) + ')');
console.log('  Used for: DIVI vault staking support');
console.log('  Alias of: OP_NOP10');

console.log('\nOP_CHECKCOLDSTAKEVERIFY:', OPS.OP_CHECKCOLDSTAKEVERIFY, '(0x' + OPS.OP_CHECKCOLDSTAKEVERIFY.toString(16) + ')');
console.log('  Used for: Cold staking verification');

console.log('\nOP_CHECKCOLDSTAKEVERIFY_LOF:', OPS.OP_CHECKCOLDSTAKEVERIFY_LOF, '(0x' + OPS.OP_CHECKCOLDSTAKEVERIFY_LOF.toString(16) + ')');
console.log('  Used for: Cold staking with last output free');

console.log('\nOP_EXCHANGEADDR:', OPS.OP_EXCHANGEADDR, '(0x' + OPS.OP_EXCHANGEADDR.toString(16) + ')');
console.log('  Used for: Exchange address support');

console.log('\n=== Opcode Lookup Test ===');
console.log('OPS[185]:', OPS[185], '(should be OP_REQUIRE_COINSTAKE)');
console.log('OPS[210]:', OPS[210], '(should be OP_CHECKCOLDSTAKEVERIFY)');
console.log('OPS[224]:', OPS[224], '(should be OP_EXCHANGEADDR)');

console.log('\n✅ All DIVI opcodes available!');
