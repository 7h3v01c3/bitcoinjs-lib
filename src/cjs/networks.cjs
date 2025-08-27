'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.testnet = exports.regtest = exports.bitcoin = exports.divi = exports.diviTestnet = void 0;

/**
 * Represents the DIVI mainnet configuration.
 */
exports.divi = {
  messagePrefix: '\x19Divi Signed Message:\n',
  bech32: undefined, // DIVI doesn't use Bech32
  bip32: {
    public: 0x0488b21e, // Same as Bitcoin
    private: 0x0488ade4,
  },
  pubKeyHash: 0x1E,   // Addresses start with 'D'
  scriptHash: 0x0D,   // Script addresses start with '3'
  wif: 0x9E           // WIFs start with 'Y'
};

/**
 * Represents the DIVI testnet configuration.
 */
exports.diviTestnet = {
  messagePrefix: '\x19Divi Signed Message:\n',
  bech32: undefined,
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
  },
  pubKeyHash: 0x8b,   // Testnet address prefix
  scriptHash: 0x13,
  wif: 0xef
};

/**
 * Represents the Bitcoin mainnet configuration.
 */
exports.bitcoin = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bc',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
};

/**
 * Represents the regtest configuration.
 */
exports.regtest = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bcrt',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};

/**
 * Represents the Bitcoin testnet configuration.
 */
exports.testnet = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'tb',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};