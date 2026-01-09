# Xray MCP Server

A Model Context Protocol (MCP) server for generating Xray-core configurations using natural language. This server allows LLMs to create server and client configurations for various proxy protocols.

## Features

- **Protocol Support**: VLESS, VMess, Trojan, Shadowsocks
- **Transport Support**: TCP, WebSocket, gRPC, XHTTP
- **Security Support**: None, TLS, REALITY
- **Automatic Key Generation**: UUID, X25519 key pairs, Short IDs, Passwords
- **Configuration Validation**: Syntax and semantic validation
- **Example Configurations**: Ready-to-use templates
- **Documentation**: Built-in protocol, transport, and security documentation

## Installation

```bash
npm install
npm run build
```

## Usage with Cursor

Add to your Cursor MCP settings (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "xray-mcp": {
      "command": "node",
      "args": ["/path/to/xray-mcp/dist/index.js"]
    }
  }
}
```

## Available Tools

### Configuration Generation

#### `generate_server_config`
Generate Xray server configuration with specified protocol, transport, and security options.

**Example:**
```
Generate a VLESS server with REALITY on port 443
```

#### `generate_client_config`
Generate Xray client configuration for connecting to a proxy server.

**Example:**
```
Create a client config for VLESS+REALITY server at example.com:443
```

### Key Generation

#### `generate_uuid`
Generate a new UUID v4 for VLESS/VMess authentication.

#### `generate_x25519_keypair`
Generate X25519 key pair for REALITY (returns private and public keys).

#### `generate_short_id`
Generate a random short ID for REALITY authentication.

#### `generate_password`
Generate a random password for Trojan or Shadowsocks.

#### `generate_ss2022_key`
Generate a base64 key for Shadowsocks 2022.

### Utilities

#### `validate_config`
Validate an Xray configuration for syntax and semantic errors.

#### `list_protocols`
List all supported proxy protocols with descriptions.

#### `list_transports`
List all supported transport types with descriptions.

#### `list_security`
List all supported security types with descriptions.

#### `list_reality_targets`
List recommended target sites for REALITY.

## Available Resources

- `xray://docs/protocols` - Protocol documentation
- `xray://docs/transports` - Transport documentation
- `xray://docs/security` - Security documentation
- `xray://examples/server-vless-reality` - VLESS+REALITY server example
- `xray://examples/client-vless-reality` - VLESS+REALITY client example
- `xray://examples/server-vmess-ws-tls` - VMess+WS+TLS server example
- `xray://examples/server-trojan-tls` - Trojan+TLS server example
- `xray://examples/server-shadowsocks-2022` - Shadowsocks 2022 server example

## Example Conversations

### Create a VLESS+REALITY Server

**User:** Create a VLESS server with REALITY on port 443, targeting microsoft.com

**Assistant:** (calls `generate_server_config` with appropriate parameters)

### Create Matching Client Config

**User:** Generate a client config to connect to this server

**Assistant:** (calls `generate_client_config` with server details)

### Generate Keys

**User:** Generate a new UUID and X25519 key pair for REALITY

**Assistant:** (calls `generate_uuid` and `generate_x25519_keypair`)

## Supported Configurations

### Protocols

| Protocol | Description | Auth Type |
|----------|-------------|-----------|
| VLESS | Lightweight, supports XTLS Vision | UUID |
| VMess | Classic V2Ray protocol | UUID |
| Trojan | HTTPS-mimicking | Password |
| Shadowsocks | Simple and fast | Password |

### Transports

| Transport | CDN Support | REALITY Support |
|-----------|-------------|-----------------|
| TCP | No | Yes |
| WebSocket | Yes | No |
| gRPC | Partial | Yes |
| XHTTP | Yes | Yes |

### Security

| Security | Certificate Required | Description |
|----------|---------------------|-------------|
| None | No | No encryption |
| TLS | Yes | Standard TLS |
| REALITY | No | Advanced camouflage |

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run in development mode
npm run dev
```

## License

MIT
