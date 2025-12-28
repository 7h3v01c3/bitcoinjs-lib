# divijs-lib

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A JavaScript DIVI library for node.js and browsers, based on bitcoinjs-lib. Written in TypeScript, but committing the JS files to verify.

**This is a DIVI-enhanced fork of bitcoinjs-lib**, adding support for:
- DIVI network configurations (mainnet and testnet)
- DIVI-specific opcodes (OP_REQUIRE_COINSTAKE, OP_CHECKCOLDSTAKEVERIFY, OP_EXCHANGEADDR)
- DIVI vault script support
- Legacy address support (DIVI does not yet support SegWit or Bech32)

Released under the terms of the [MIT LICENSE](LICENSE).

## Should I use this in production?
If you are thinking of using the *divijs-lib* branch of this library in production, **stop**.
This branch is not stable; it is our development branch, and only tagged releases may be classified as stable.

## Can I trust this code?
> Don't trust. Verify.

We recommend every user of this library audit and verify any underlying code for its validity and suitability, including reviewing any and all of your project's dependencies.

**DIVI-Specific Considerations:**
- This library supports DIVI vaults and staking operations - ensure you understand the security implications
- DIVI does not yet support SegWit or Bech32 - uses legacy addresses (P2PKH/P2SH)
- Vault operations require careful key management - owner keys and host keys must be secured separately
- Staking operations involve off-chain payments to hosts - verify all service agreements

Mistakes and bugs happen, but with your help in resolving and reporting issues, together we can produce open source software that is:

- Easy to audit and verify,
- Tested, with test coverage >95%,
- Advanced and feature rich,
- Standardized, using [prettier](https://github.com/prettier/prettier) and Node `Buffer`'s throughout, and
- Friendly, with a strong and helpful community, ready to answer questions.

## Documentation
This library is based on [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib) and maintains compatibility with most Bitcoin functionality while adding DIVI-specific features.

For DIVI-specific features:
- DIVI network configurations: `import { divi, diviTestnet } from 'divijs-lib'`
- DIVI opcodes: `import { OPS } from 'divijs-lib'` (includes OP_REQUIRE_COINSTAKE, OP_CHECKCOLDSTAKEVERIFY, etc.)
- Legacy address support: DIVI uses P2PKH (addresses starting with 'D') and P2SH (addresses starting with '3')

If you need further guidance, please create an issue in this repository.

## How can I contact the developers?
This is a personal repository for DIVI support. For general bitcoinjs-lib questions, please refer to the [original bitcoinjs-lib repository](https://github.com/bitcoinjs/bitcoinjs-lib).

Open up a discussion here or hit me up on Telegram.

## Installation

**Note:** This library is not yet published to npm. Install directly from GitHub:

``` bash
npm install github:7h3v01c3/bitcoinjs-lib#divijs-lib
# optionally, install a key derivation library as well
npm install ecpair bip32
# ecpair is the ECPair class for single keys
# bip32 is for generating HD keys
```

Previous versions of the library included classes for key management (ECPair, HDNode(->"bip32")) but now these have been separated into different libraries. This lowers the bundle size significantly if you don't need to perform any crypto functions (converting private to public keys and deriving HD keys).

Typically we support the [Node Maintenance LTS version](https://github.com/nodejs/Release). TypeScript target will be set
to the ECMAScript version in which all features are fully supported by current Active Node LTS.
However, depending on adoption among other environments (browsers etc.) we may keep the target back a year or two.
If in doubt, see the [main_ci.yml](.github/workflows/main_ci.yml) for what versions are used by our continuous integration tests.

**WARNING**: We presently don't provide any tooling to verify that the release on `npm` matches GitHub.  As such, you should verify anything downloaded by `npm` against your own verified copy.


## Usage
Crypto is hard.

When working with private keys, the random number generator is fundamentally one of the most important parts of any software you write.
For random number generation, we *default* to the [`randombytes`](https://github.com/crypto-browserify/randombytes) module, which uses [`window.crypto.getRandomValues`](https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues) in the browser, or Node js' [`crypto.randomBytes`](https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback), depending on your build system.
Although this default is ~OK, there is no simple way to detect if the underlying RNG provided is good enough, or if it is **catastrophically bad**.
You should always verify this yourself to your own standards.

This library uses [tiny-secp256k1](https://github.com/bitcoinjs/tiny-secp256k1), which uses [RFC6979](https://tools.ietf.org/html/rfc6979) to help prevent `k` re-use and exploitation.
Unfortunately, this isn't a silver bullet.
Often, Javascript itself is working against us by bypassing these counter-measures.

Problems in [`Buffer (UInt8Array)`](https://github.com/feross/buffer), for example, can trivially result in **catastrophic fund loss** without any warning.
It can do this through undermining your random number generation, accidentally producing a [duplicate `k` value](https://web.archive.org/web/20160308014317/http://www.nilsschneider.net/2013/01/28/recovering-bitcoin-private-keys.html), sending DIVI to a malformed output script, or any of a million different ways.
Running tests in your target environment is important and a recommended step to verify continuously.

Finally, **adhere to best practice**.
We are not an authoritative source of best practice, but, at the very least:

* [Don't reuse addresses](https://en.bitcoin.it/wiki/Address_reuse).
* Don't share BIP32 extended public keys ('xpubs'). [They are a liability](https://bitcoin.stackexchange.com/questions/56916/derivation-of-parent-private-key-from-non-hardened-child), and it only takes 1 misplaced private key (or a buggy implementation!) and you are vulnerable to **catastrophic fund loss**.
* [Don't use `Math.random`](https://security.stackexchange.com/questions/181580/why-is-math-random-not-designed-to-be-cryptographically-secure) - in any way - don't.
* Enforce that users always verify (manually) a freshly-decoded human-readable version of their intended transaction before broadcast.
* [Don't *ask* users to generate mnemonics](https://en.bitcoin.it/wiki/Brainwallet#cite_note-1), or 'brain wallets',  humans are terrible random number generators.
* **DIVI Vault Security**: Keep owner keys and host keys separate. Owner keys should be stored securely offline when possible. Host keys enable staking but should not have spending control.
* **DIVI Staking**: Understand the difference between vault staking (off-chain host payments) and cold staking delegation (on-chain fee extraction). Vaults provide better decentralization.
* **DIVI Addresses**: DIVI does not yet support SegWit or Bech32. Use legacy addresses (P2PKH/P2SH) only.
* Lastly, if you can, use [Typescript](https://www.typescriptlang.org/) or similar.


### Browser
The recommended method of using `divijs-lib` in your browser is through [browserify](http://browserify.org/).

If you'd like to use a different (more modern) build tool than `browserify`, you can compile just this library and its dependencies into a single JavaScript file:

```sh
$ npm install github:7h3v01c3/bitcoinjs-lib#divijs-lib browserify
$ npx browserify --standalone divi -o divijs-lib.js <<< "module.exports = require('bitcoinjs-lib');"
```

Which you can then import as an ESM module:

```javascript
<script type="module">import "/scripts/divijs-lib.js"</script>
````

**Note:** DIVI does not yet support SegWit or Bech32. This library focuses on legacy address support (P2PKH/P2SH) and DIVI-specific features like vaults and staking.

**NOTE**: We use Node Maintenance LTS features, if you need strict ES5, use [`--transform babelify`](https://github.com/babel/babelify) in conjunction with your `browserify` step (using an [`es2015`](https://babeljs.io/docs/plugins/preset-es2015/) preset).

**WARNING**: iOS devices have [problems](https://github.com/feross/buffer/issues/136), use at least [buffer@5.0.5](https://github.com/feross/buffer/pull/155) or greater,  and enforce the test suites (for `Buffer`, and any other dependency) pass before use.

### Typescript or VSCode users
Type declarations for Typescript are included in this library. Normal installation should include all the needed type information.

## Examples

**DIVI-Specific Examples:**
- Generate a DIVI mainnet address (P2PKH, starts with 'D')
- Generate a DIVI testnet address
- Create a DIVI vault script with OP_REQUIRE_COINSTAKE
- Create a DIVI transaction with legacy addresses
- Use DIVI network configurations

**Standard Examples (Compatible with DIVI):**
- Generate a random address (using DIVI network)
- Import an address via WIF
- Generate a 2-of-3 P2SH multisig address
- Create a 1-to-1 Transaction
- Create a Transaction with an OP_RETURN output
- Create a Transaction with a 2-of-4 P2SH(multisig) input
- Create a Transaction and sign with an HDSigner interface (bip32)
- Import a BIP32 testnet xpriv and export to WIF
- Export a BIP32 xpriv, then import it
- Export a BIP32 xpub
- Use BIP39 to generate BIP32 addresses
- Create a Transaction where Alice can redeem the output after the expiry (CLTV)
- Create a Transaction where Alice can redeem the output after the expiry (CSV)

**Note:** SegWit and Bech32 examples are not applicable to DIVI, as DIVI does not yet support SegWit or Bech32.

If you have a DIVI-specific use case that you feel could be listed here, please create an issue!


## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md).


### Running the test suite

``` bash
npm test
npm run-script coverage
```

## Complementing Libraries
- [BIP21](https://github.com/bitcoinjs/bip21) - A BIP21 compatible URL encoding library
- [BIP38](https://github.com/bitcoinjs/bip38) - Passphrase-protected private keys
- [BIP39](https://github.com/bitcoinjs/bip39) - Mnemonic generation for deterministic keys
- [BIP32-Utils](https://github.com/bitcoinjs/bip32-utils) - A set of utilities for working with BIP32
- [BIP66](https://github.com/bitcoinjs/bip66) - Strict DER signature decoding
- [BIP68](https://github.com/bitcoinjs/bip68) - Relative lock-time encoding library
- [BIP69](https://github.com/bitcoinjs/bip69) - Lexicographical Indexing of Transaction Inputs and Outputs
- [Base58](https://github.com/cryptocoinjs/bs58) - Base58 encoding/decoding
- [Base58 Check](https://github.com/bitcoinjs/bs58check) - Base58 check encoding/decoding
- [coinselect](https://github.com/bitcoinjs/coinselect) - A fee-optimizing, transaction input selection module
- [merkle-lib](https://github.com/bitcoinjs/merkle-lib) - A performance conscious library for merkle root and tree calculations.
- [minimaldata](https://github.com/bitcoinjs/minimaldata) - A module to check bitcoin policy: SCRIPT_VERIFY_MINIMALDATA

**Note:** Bech32 libraries are not needed for DIVI, as DIVI does not yet support SegWit or Bech32.

## Based On
This library is a fork of [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib), enhanced with DIVI-specific features while maintaining compatibility with the core Bitcoin functionality.


## LICENSE [MIT](LICENSE)
