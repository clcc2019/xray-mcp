# Xray Security Documentation

## Overview

Security layer provides encryption and authentication for the transport. Xray supports TLS and REALITY.

## Security Types

### None

No encryption at transport layer. Only use when:
- Traffic is already encrypted (e.g., local connections)
- Protocol has built-in encryption (VMess, Shadowsocks)
- Testing purposes

**Warning:** Not recommended for production use without protocol-level encryption.

---

### TLS

Standard TLS encryption using certificates.

**Requirements:**
- Valid SSL/TLS certificate
- Private key
- Domain name (recommended)

**Features:**
- Industry-standard encryption
- Certificate-based authentication
- ALPN negotiation
- Client fingerprinting

**Server Settings:**
```json
{
  "security": "tls",
  "tlsSettings": {
    "serverName": "example.com",
    "certificates": [
      {
        "certificateFile": "/path/to/cert.pem",
        "keyFile": "/path/to/key.pem"
      }
    ],
    "alpn": ["h2", "http/1.1"],
    "minVersion": "1.2",
    "rejectUnknownSni": false
  }
}
```

**Client Settings:**
```json
{
  "security": "tls",
  "tlsSettings": {
    "serverName": "example.com",
    "allowInsecure": false,
    "fingerprint": "chrome",
    "alpn": ["h2", "http/1.1"]
  }
}
```

**Fingerprints:**
- `chrome`: Chrome browser
- `firefox`: Firefox browser
- `safari`: Safari browser
- `ios`: iOS Safari
- `android`: Android Chrome
- `edge`: Microsoft Edge
- `qq`: QQ browser
- `360`: 360 browser
- `random`: Random selection
- `randomized`: Randomized fingerprint

---

### REALITY

Advanced TLS camouflage technology that doesn't require certificates.

**How it works:**
1. Client connects using TLS with target server's certificate
2. Server authenticates client using X25519 key exchange
3. If authentication fails, traffic is forwarded to target server
4. If authentication succeeds, proxy connection is established

**Advantages:**
- No certificate needed
- Traffic looks identical to target website
- Resistant to active probing
- Perfect forward secrecy

**Requirements:**
- X25519 key pair
- Target website (dest)
- Short IDs for authentication

**Server Settings:**
```json
{
  "security": "reality",
  "realitySettings": {
    "show": false,
    "dest": "www.microsoft.com:443",
    "xver": 0,
    "serverNames": ["www.microsoft.com"],
    "privateKey": "base64url-encoded-private-key",
    "shortIds": ["abcd1234", "ef56", ""],
    "minClientVer": "",
    "maxClientVer": "",
    "maxTimeDiff": 0
  }
}
```

**Client Settings:**
```json
{
  "security": "reality",
  "realitySettings": {
    "serverName": "www.microsoft.com",
    "fingerprint": "chrome",
    "publicKey": "base64url-encoded-public-key",
    "shortId": "abcd1234",
    "spiderX": "/"
  }
}
```

**Recommended Target Sites:**
- `www.microsoft.com` - Microsoft (most recommended)
- `www.apple.com` - Apple
- `www.amazon.com` - Amazon
- `www.cloudflare.com` - Cloudflare
- `www.google.com` - Google

**Target Site Requirements:**
- Supports TLS 1.3
- Has HTTP/2 enabled
- Stable and fast
- Not blocked in your region

---

## Key Generation

### X25519 Key Pair (for REALITY)

Generate using Xray:
```bash
xray x25519
```

Or use the MCP tool:
```
generate_x25519_keypair
```

Output:
```
Private key: base64url-encoded-private-key
Public key: base64url-encoded-public-key
```

### Short ID

Short ID is a hex string (0-16 characters) used for client authentication.

Examples:
- `abcd1234` (8 characters)
- `ef56` (4 characters)
- `` (empty, allows any)

---

## Security Comparison

| Feature | None | TLS | REALITY |
|---------|------|-----|---------|
| Encryption | No | Yes | Yes |
| Certificate | No | Required | Not needed |
| Active probe resistant | No | Partial | Yes |
| Traffic camouflage | No | Partial | Excellent |
| Setup complexity | Low | Medium | Medium |

## Best Practices

1. **Always use TLS or REALITY** for production
2. **Use REALITY** when possible for best camouflage
3. **Keep private keys secure** and never share them
4. **Use strong short IDs** for REALITY
5. **Enable client fingerprinting** to mimic real browsers
6. **Choose appropriate target sites** for REALITY
7. **Regularly rotate keys** for enhanced security
8. **Monitor for certificate expiration** when using TLS
