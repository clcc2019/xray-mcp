/**
 * Generate a new UUID v4
 */
export declare function generateUUID(): string;
/**
 * Generate X25519 key pair for REALITY
 * Returns base64url encoded keys (without padding)
 */
export declare function generateX25519KeyPair(): {
    privateKey: string;
    publicKey: string;
};
/**
 * Generate a random short ID for REALITY (hex string, 0-16 chars)
 */
export declare function generateShortId(length?: number): string;
/**
 * Generate a random password for Shadowsocks/Trojan
 */
export declare function generatePassword(length?: number): string;
/**
 * Generate a base64 key for Shadowsocks 2022
 * Key length depends on cipher:
 * - 2022-blake3-aes-128-gcm: 16 bytes
 * - 2022-blake3-aes-256-gcm: 32 bytes
 * - 2022-blake3-chacha20-poly1305: 32 bytes
 */
export declare function generateShadowsocks2022Key(cipher: string): string;
/**
 * Validate a UUID string
 */
export declare function isValidUUID(uuid: string): boolean;
/**
 * Validate a base64url encoded X25519 key
 */
export declare function isValidX25519Key(key: string): boolean;
//# sourceMappingURL=crypto.d.ts.map