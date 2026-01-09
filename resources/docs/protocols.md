# Xray Protocols Documentation

## Overview

Xray-core supports multiple proxy protocols, each with different characteristics and use cases.

## Protocols

### VLESS

**Type:** Lightweight proxy protocol  
**Authentication:** UUID  
**Encryption:** None (relies on transport layer encryption)

VLESS is a stateless, lightweight protocol designed for Xray. It has minimal overhead and supports XTLS Vision for better performance.

**Features:**
- Zero protocol overhead
- Supports XTLS Vision flow control
- Works with TLS and REALITY
- Fallback support for traffic camouflage

**Recommended for:**
- High-performance scenarios
- REALITY deployment
- Low-latency requirements

**Server Settings:**
```json
{
  "clients": [
    {
      "id": "uuid",
      "flow": "xtls-rprx-vision",
      "level": 0,
      "email": "user@example.com"
    }
  ],
  "decryption": "none",
  "fallbacks": [
    {"dest": 80}
  ]
}
```

**Client Settings:**
```json
{
  "address": "server.com",
  "port": 443,
  "id": "uuid",
  "flow": "xtls-rprx-vision",
  "encryption": "none"
}
```

---

### VMess

**Type:** Classic V2Ray protocol  
**Authentication:** UUID  
**Encryption:** AES-128-GCM, ChaCha20-Poly1305, Auto, None

VMess is the original V2Ray protocol with built-in encryption and authentication.

**Features:**
- Multiple encryption methods
- Time-based authentication
- Supports all transport types

**Recommended for:**
- General use cases
- When protocol-level encryption is needed

**Server Settings:**
```json
{
  "clients": [
    {
      "id": "uuid",
      "level": 0,
      "email": "user@example.com"
    }
  ]
}
```

**Client Settings:**
```json
{
  "address": "server.com",
  "port": 443,
  "id": "uuid",
  "security": "auto"
}
```

---

### Trojan

**Type:** HTTPS-mimicking protocol  
**Authentication:** Password  
**Encryption:** None (requires TLS)

Trojan disguises proxy traffic as regular HTTPS traffic, making it difficult to detect.

**Features:**
- Looks like normal HTTPS traffic
- Simple password authentication
- Fallback support
- Requires TLS

**Recommended for:**
- Environments with deep packet inspection
- When traffic camouflage is important

**Server Settings:**
```json
{
  "clients": [
    {
      "password": "your-password",
      "level": 0,
      "email": "user@example.com"
    }
  ],
  "fallbacks": [
    {"dest": 80}
  ]
}
```

**Client Settings:**
```json
{
  "address": "server.com",
  "port": 443,
  "password": "your-password"
}
```

---

### Shadowsocks

**Type:** Lightweight encrypted proxy  
**Authentication:** Password  
**Encryption:** AEAD ciphers (AES-GCM, ChaCha20-Poly1305) or 2022 ciphers

Shadowsocks is a simple and fast proxy protocol with various encryption options.

**Supported Ciphers:**
- `aes-128-gcm`
- `aes-256-gcm`
- `chacha20-poly1305`
- `xchacha20-poly1305`
- `2022-blake3-aes-128-gcm` (recommended)
- `2022-blake3-aes-256-gcm` (recommended)
- `2022-blake3-chacha20-poly1305`

**Features:**
- Simple configuration
- UDP support
- 2022 version with improved security

**Recommended for:**
- Simple deployments
- When compatibility is important

**Server Settings (2022):**
```json
{
  "method": "2022-blake3-aes-256-gcm",
  "password": "base64-encoded-key",
  "network": "tcp,udp"
}
```

**Client Settings:**
```json
{
  "address": "server.com",
  "port": 8388,
  "method": "2022-blake3-aes-256-gcm",
  "password": "base64-encoded-key"
}
```

---

## Protocol Comparison

| Protocol | Encryption | Auth Type | TLS Required | Best For |
|----------|------------|-----------|--------------|----------|
| VLESS | None | UUID | Recommended | Performance |
| VMess | Built-in | UUID | Optional | General use |
| Trojan | None | Password | Required | Camouflage |
| Shadowsocks | Built-in | Password | Optional | Simplicity |

## Security Recommendations

1. **Always use TLS or REALITY** for production deployments
2. **Use strong passwords** for Trojan and Shadowsocks
3. **Generate unique UUIDs** for each user
4. **Enable sniffing** to detect protocol and apply routing rules
5. **Use fallback** to handle non-proxy traffic gracefully
