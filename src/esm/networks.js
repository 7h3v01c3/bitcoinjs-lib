/**
 * Represents the Bitcoin network configuration.
 */
export const bitcoin = {
  /**
   * The message prefix used for signing Bitcoin messages.
   */
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  /**
   * The Bech32 prefix used for Bitcoin addresses.
   */
  bech32: 'bc',
  /**
   * The BIP32 key prefixes for Bitcoin.
   */
  bip32: {
    /**
     * The public key prefix for BIP32 extended public keys.
     */
    public: 0x0488b21e,
    /**
     * The private key prefix for BIP32 extended private keys.
     */
    private: 0x0488ade4,
  },
  /**
   * The prefix for Bitcoin public key hashes.
   */
  pubKeyHash: 0x00,
  /**
   * The prefix for Bitcoin script hashes.
   */
  scriptHash: 0x05,
  /**
   * The prefix for Bitcoin Wallet Import Format (WIF) private keys.
   */
  wif: 0x80,
};
/**
 * Represents the regtest network configuration.
 */
export const regtest = {
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
 * Represents the testnet network configuration.
 */
export const testnet = {
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
/**
 * Represents the DIVI mainnet configuration.
 */
export const divi = {
  messagePrefix: '\x19Divi Signed Message:\n',
  bech32: undefined, // DIVI doesn't use Bech32
  bip32: {
    public: 0x0488b21e, // Same as Bitcoin
    private: 0x0488ade4,
  },
  pubKeyHash: 0x1e, // Addresses start with 'D'
  scriptHash: 0x0d, // Script addresses start with '3'
  wif: 0x9e, // WIFs start with 'Y'
};
/**
 * Represents the DIVI testnet configuration.
 */
export const diviTestnet = {
  messagePrefix: '\x19Divi Signed Message:\n',
  bech32: undefined,
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
  },
  pubKeyHash: 0x8b, // Testnet address prefix
  scriptHash: 0x13,
  wif: 0xef,
};
