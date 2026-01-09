import nacl from 'tweetnacl';
import tweetnaclUtil from 'tweetnacl-util';
import { v4 as uuidv4 } from 'uuid';
const { encodeBase64, decodeBase64 } = tweetnaclUtil;
/**
 * Generate a new UUID v4
 */
export function generateUUID() {
    return uuidv4();
}
/**
 * Generate X25519 key pair for REALITY
 * Returns base64url encoded keys (without padding)
 */
export function generateX25519KeyPair() {
    const keyPair = nacl.box.keyPair();
    // Convert to base64url (replace + with -, / with _, remove =)
    const privateKey = encodeBase64(keyPair.secretKey)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    const publicKey = encodeBase64(keyPair.publicKey)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    return { privateKey, publicKey };
}
/**
 * Generate a random short ID for REALITY (hex string, 0-16 chars)
 */
export function generateShortId(length = 8) {
    if (length < 0 || length > 16) {
        throw new Error('Short ID length must be between 0 and 16');
    }
    if (length === 0)
        return '';
    const bytes = nacl.randomBytes(Math.ceil(length / 2));
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, length);
}
/**
 * Generate a random password for Shadowsocks/Trojan
 */
export function generatePassword(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const bytes = nacl.randomBytes(length);
    return Array.from(bytes)
        .map(b => chars[b % chars.length])
        .join('');
}
/**
 * Generate a base64 key for Shadowsocks 2022
 * Key length depends on cipher:
 * - 2022-blake3-aes-128-gcm: 16 bytes
 * - 2022-blake3-aes-256-gcm: 32 bytes
 * - 2022-blake3-chacha20-poly1305: 32 bytes
 */
export function generateShadowsocks2022Key(cipher) {
    let keyLength;
    switch (cipher) {
        case '2022-blake3-aes-128-gcm':
            keyLength = 16;
            break;
        case '2022-blake3-aes-256-gcm':
        case '2022-blake3-chacha20-poly1305':
            keyLength = 32;
            break;
        default:
            throw new Error(`Unsupported Shadowsocks 2022 cipher: ${cipher}`);
    }
    const key = nacl.randomBytes(keyLength);
    return encodeBase64(key);
}
/**
 * Validate a UUID string
 */
export function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
/**
 * Validate a base64url encoded X25519 key
 */
export function isValidX25519Key(key) {
    try {
        // Add padding if needed
        let padded = key.replace(/-/g, '+').replace(/_/g, '/');
        while (padded.length % 4) {
            padded += '=';
        }
        const decoded = decodeBase64(padded);
        return decoded.length === 32;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=crypto.js.map