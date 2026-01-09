# Xray Transport Documentation

## Overview

Transport layer determines how data is transmitted between client and server. Different transports have different characteristics for performance, compatibility, and camouflage.

## Transports

### TCP (RAW)

**Type:** Direct TCP connection  
**Overhead:** Minimal  
**CDN Support:** No

Raw TCP is the simplest and fastest transport with minimal overhead.

**Features:**
- Lowest latency
- Supports REALITY
- HTTP header obfuscation (optional)

**Recommended for:**
- Direct connections
- REALITY deployments
- Performance-critical scenarios

**Settings:**
```json
{
  "network": "tcp",
  "tcpSettings": {
    "acceptProxyProtocol": false,
    "header": {
      "type": "none"
    }
  }
}
```

---

### WebSocket (WS)

**Type:** WebSocket over HTTP  
**Overhead:** Medium  
**CDN Support:** Yes

WebSocket transport wraps traffic in WebSocket protocol, allowing it to pass through CDNs and reverse proxies.

**Features:**
- CDN compatible
- Reverse proxy friendly
- Path-based routing

**Recommended for:**
- CDN deployments
- Behind reverse proxy (nginx, caddy)
- Shared hosting

**Settings:**
```json
{
  "network": "ws",
  "wsSettings": {
    "path": "/ws",
    "host": "example.com",
    "headers": {
      "User-Agent": "Mozilla/5.0"
    }
  }
}
```

---

### gRPC

**Type:** gRPC over HTTP/2  
**Overhead:** Medium  
**CDN Support:** Partial

gRPC transport uses HTTP/2 with gRPC framing, supporting multiplexing.

**Features:**
- HTTP/2 multiplexing
- Supports REALITY
- Multi-mode for better performance

**Recommended for:**
- High-throughput scenarios
- When HTTP/2 is required

**Settings:**
```json
{
  "network": "grpc",
  "grpcSettings": {
    "serviceName": "myservice",
    "multiMode": true
  }
}
```

---

### XHTTP (SplitHTTP)

**Type:** Next-generation HTTP transport  
**Overhead:** Low-Medium  
**CDN Support:** Yes

XHTTP is the newest transport supporting HTTP/2 and HTTP/3, designed to replace WebSocket and gRPC.

**Features:**
- HTTP/2 and HTTP/3 support
- Supports REALITY
- Better performance than WebSocket
- Multiple operation modes

**Modes:**
- `auto`: Automatically select best mode
- `packet-up`: Packet-based upload
- `stream-up`: Stream-based upload
- `stream-one`: Single stream mode

**Recommended for:**
- New deployments
- When HTTP/3 is available
- CDN with HTTP/2 or HTTP/3 support

**Settings:**
```json
{
  "network": "xhttp",
  "xhttpSettings": {
    "path": "/xhttp",
    "host": "example.com",
    "mode": "auto"
  }
}
```

---

### mKCP

**Type:** UDP-based transport  
**Overhead:** High  
**CDN Support:** No

mKCP is a UDP-based transport with congestion control, useful when TCP is throttled.

**Features:**
- UDP-based
- Header obfuscation
- Congestion control

**Header Types:**
- `none`: No obfuscation
- `srtp`: SRTP (video call)
- `utp`: uTP (BitTorrent)
- `wechat-video`: WeChat video call
- `dtls`: DTLS
- `wireguard`: WireGuard
- `dns`: DNS query

**Recommended for:**
- When TCP is throttled
- Gaming scenarios
- Real-time applications

**Settings:**
```json
{
  "network": "mkcp",
  "kcpSettings": {
    "mtu": 1350,
    "tti": 50,
    "uplinkCapacity": 5,
    "downlinkCapacity": 20,
    "congestion": false,
    "readBufferSize": 2,
    "writeBufferSize": 2,
    "header": {
      "type": "wechat-video"
    },
    "seed": "optional-seed"
  }
}
```

---

### HTTPUpgrade

**Type:** HTTP Upgrade  
**Overhead:** Low  
**CDN Support:** Partial

HTTPUpgrade uses HTTP Upgrade mechanism, similar to WebSocket but simpler.

**Features:**
- Simpler than WebSocket
- Lower overhead
- Path-based routing

**Settings:**
```json
{
  "network": "httpupgrade",
  "httpupgradeSettings": {
    "path": "/upgrade",
    "host": "example.com"
  }
}
```

---

## Transport Comparison

| Transport | Overhead | CDN | REALITY | Best For |
|-----------|----------|-----|---------|----------|
| TCP | Minimal | No | Yes | Performance |
| WebSocket | Medium | Yes | No | CDN |
| gRPC | Medium | Partial | Yes | Multiplexing |
| XHTTP | Low-Medium | Yes | Yes | Modern deployments |
| mKCP | High | No | No | UDP scenarios |
| HTTPUpgrade | Low | Partial | No | Simple CDN |

## Recommendations

1. **For REALITY:** Use TCP, gRPC, or XHTTP
2. **For CDN:** Use WebSocket or XHTTP
3. **For performance:** Use TCP with REALITY
4. **For compatibility:** Use WebSocket
5. **For modern deployments:** Use XHTTP with HTTP/2 or HTTP/3
