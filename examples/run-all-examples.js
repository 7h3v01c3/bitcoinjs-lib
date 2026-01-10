/**
 * Run all DIVI examples
 * Run with: node examples/run-all-examples.js
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const examples = [
  'test-divi-networks.js',
  'test-divi-opcodes.js',
  'test-divi-vault-script.js',
  'test-divi-address.js',
  'test-divi-key-derivation.js'
];

console.log('=== Running All DIVI Examples ===\n');

examples.forEach((example, index) => {
  console.log(`\n[${index + 1}/${examples.length}] Running ${example}...`);
  console.log('─'.repeat(60));
  
  try {
    execSync(`node ${path.join(__dirname, example)}`, {
      stdio: 'inherit',
      cwd: __dirname
    });
  } catch (error) {
    console.error(`\n❌ Error running ${example}:`, error.message);
    process.exit(1);
  }
  
  console.log('\n');
});

console.log('✅ All examples completed successfully!');
