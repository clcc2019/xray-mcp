#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, ErrorCode, McpError, } from '@modelcontextprotocol/sdk/types.js';
import { generateServerConfig, GenerateServerConfigInputSchema } from './tools/generate-server.js';
import { generateClientConfig, GenerateClientConfigInputSchema } from './tools/generate-client.js';
import { generateUUID, generateX25519KeyPair, generateShortId, generatePassword, generateShadowsocks2022Key } from './utils/crypto.js';
import { validateConfig, formatValidationResult } from './utils/validator.js';
import { PROTOCOL_INFO } from './schemas/protocols.js';
import { TRANSPORT_INFO } from './schemas/transports.js';
import { SECURITY_INFO, REALITY_TARGETS } from './schemas/security.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Create MCP server
const server = new Server({
    name: 'xray-mcp',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
        resources: {},
    },
});
// Tool definitions
const TOOLS = [
    {
        name: 'generate_server_config',
        description: 'Generate Xray server configuration. Supports VLESS, VMess, Trojan, and Shadowsocks protocols with various transport and security options.',
        inputSchema: {
            type: 'object',
            properties: {
                protocol: {
                    type: 'string',
                    enum: ['vless', 'vmess', 'trojan', 'shadowsocks'],
                    description: 'Protocol type',
                },
                port: {
                    type: 'number',
                    description: 'Server listening port (1-65535)',
                },
                transport: {
                    type: 'string',
                    enum: ['tcp', 'ws', 'grpc', 'xhttp'],
                    default: 'tcp',
                    description: 'Transport layer',
                },
                security: {
                    type: 'string',
                    enum: ['none', 'tls', 'reality'],
                    default: 'none',
                    description: 'Security layer',
                },
                tls_cert_file: {
                    type: 'string',
                    description: 'TLS certificate file path (required for TLS)',
                },
                tls_key_file: {
                    type: 'string',
                    description: 'TLS private key file path (required for TLS)',
                },
                reality_dest: {
                    type: 'string',
                    description: 'REALITY target destination (e.g., www.microsoft.com:443)',
                },
                reality_server_names: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'REALITY server names',
                },
                ws_path: {
                    type: 'string',
                    description: 'WebSocket path',
                },
                grpc_service_name: {
                    type: 'string',
                    description: 'gRPC service name',
                },
                xhttp_path: {
                    type: 'string',
                    description: 'XHTTP path',
                },
                users: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            email: { type: 'string' },
                        },
                    },
                    description: 'User list (auto-generated if not provided)',
                },
                ss_method: {
                    type: 'string',
                    enum: ['aes-128-gcm', 'aes-256-gcm', 'chacha20-poly1305', '2022-blake3-aes-128-gcm', '2022-blake3-aes-256-gcm', '2022-blake3-chacha20-poly1305'],
                    description: 'Shadowsocks encryption method',
                },
                vless_flow: {
                    type: 'string',
                    enum: ['', 'xtls-rprx-vision'],
                    description: 'VLESS flow control',
                },
                log_level: {
                    type: 'string',
                    enum: ['debug', 'info', 'warning', 'error', 'none'],
                    default: 'warning',
                    description: 'Log level',
                },
            },
            required: ['protocol', 'port'],
        },
    },
    {
        name: 'generate_client_config',
        description: 'Generate Xray client configuration for connecting to a proxy server.',
        inputSchema: {
            type: 'object',
            properties: {
                server_address: {
                    type: 'string',
                    description: 'Server address (IP or domain)',
                },
                server_port: {
                    type: 'number',
                    description: 'Server port',
                },
                protocol: {
                    type: 'string',
                    enum: ['vless', 'vmess', 'trojan', 'shadowsocks'],
                    description: 'Protocol type',
                },
                uuid: {
                    type: 'string',
                    description: 'User UUID (for VLESS/VMess)',
                },
                password: {
                    type: 'string',
                    description: 'Password (for Trojan/Shadowsocks)',
                },
                transport: {
                    type: 'string',
                    enum: ['tcp', 'ws', 'grpc', 'xhttp'],
                    default: 'tcp',
                    description: 'Transport layer',
                },
                security: {
                    type: 'string',
                    enum: ['none', 'tls', 'reality'],
                    default: 'none',
                    description: 'Security layer',
                },
                tls_server_name: {
                    type: 'string',
                    description: 'TLS server name (SNI)',
                },
                tls_fingerprint: {
                    type: 'string',
                    enum: ['chrome', 'firefox', 'safari', 'ios', 'android', 'edge', 'random'],
                    description: 'TLS fingerprint',
                },
                reality_public_key: {
                    type: 'string',
                    description: 'REALITY public key',
                },
                reality_short_id: {
                    type: 'string',
                    description: 'REALITY short ID',
                },
                reality_server_name: {
                    type: 'string',
                    description: 'REALITY server name',
                },
                ws_path: {
                    type: 'string',
                    description: 'WebSocket path',
                },
                grpc_service_name: {
                    type: 'string',
                    description: 'gRPC service name',
                },
                socks_port: {
                    type: 'number',
                    default: 1080,
                    description: 'Local SOCKS5 proxy port',
                },
                http_port: {
                    type: 'number',
                    description: 'Local HTTP proxy port',
                },
                routing_mode: {
                    type: 'string',
                    enum: ['global', 'bypass_cn', 'bypass_lan', 'bypass_lan_cn'],
                    default: 'global',
                    description: 'Routing mode',
                },
                ss_method: {
                    type: 'string',
                    description: 'Shadowsocks encryption method',
                },
                vless_flow: {
                    type: 'string',
                    enum: ['', 'xtls-rprx-vision'],
                    description: 'VLESS flow control',
                },
            },
            required: ['server_address', 'server_port', 'protocol'],
        },
    },
    {
        name: 'generate_uuid',
        description: 'Generate a new UUID v4 for VLESS/VMess authentication',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'generate_x25519_keypair',
        description: 'Generate X25519 key pair for REALITY. Returns base64url encoded private and public keys.',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'generate_short_id',
        description: 'Generate a random short ID for REALITY authentication',
        inputSchema: {
            type: 'object',
            properties: {
                length: {
                    type: 'number',
                    default: 8,
                    description: 'Short ID length (0-16)',
                },
            },
        },
    },
    {
        name: 'generate_password',
        description: 'Generate a random password for Trojan or legacy Shadowsocks',
        inputSchema: {
            type: 'object',
            properties: {
                length: {
                    type: 'number',
                    default: 16,
                    description: 'Password length',
                },
            },
        },
    },
    {
        name: 'generate_ss2022_key',
        description: 'Generate a base64 key for Shadowsocks 2022',
        inputSchema: {
            type: 'object',
            properties: {
                cipher: {
                    type: 'string',
                    enum: ['2022-blake3-aes-128-gcm', '2022-blake3-aes-256-gcm', '2022-blake3-chacha20-poly1305'],
                    default: '2022-blake3-aes-256-gcm',
                    description: 'Shadowsocks 2022 cipher',
                },
            },
        },
    },
    {
        name: 'validate_config',
        description: 'Validate an Xray configuration for syntax and semantic errors',
        inputSchema: {
            type: 'object',
            properties: {
                config: {
                    type: 'object',
                    description: 'Xray configuration object to validate',
                },
            },
            required: ['config'],
        },
    },
    {
        name: 'list_protocols',
        description: 'List all supported proxy protocols with descriptions',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'list_transports',
        description: 'List all supported transport types with descriptions',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'list_security',
        description: 'List all supported security types with descriptions',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'list_reality_targets',
        description: 'List recommended target sites for REALITY',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
];
// Resource definitions
const RESOURCES = [
    {
        uri: 'xray://docs/protocols',
        name: 'Protocol Documentation',
        description: 'Documentation for Xray proxy protocols',
        mimeType: 'text/markdown',
    },
    {
        uri: 'xray://docs/transports',
        name: 'Transport Documentation',
        description: 'Documentation for Xray transport types',
        mimeType: 'text/markdown',
    },
    {
        uri: 'xray://docs/security',
        name: 'Security Documentation',
        description: 'Documentation for Xray security options',
        mimeType: 'text/markdown',
    },
    {
        uri: 'xray://examples/server-vless-reality',
        name: 'Server VLESS+REALITY Example',
        description: 'Example server configuration for VLESS with REALITY',
        mimeType: 'application/json',
    },
    {
        uri: 'xray://examples/client-vless-reality',
        name: 'Client VLESS+REALITY Example',
        description: 'Example client configuration for VLESS with REALITY',
        mimeType: 'application/json',
    },
    {
        uri: 'xray://examples/server-vmess-ws-tls',
        name: 'Server VMess+WS+TLS Example',
        description: 'Example server configuration for VMess with WebSocket and TLS',
        mimeType: 'application/json',
    },
    {
        uri: 'xray://examples/server-trojan-tls',
        name: 'Server Trojan+TLS Example',
        description: 'Example server configuration for Trojan with TLS',
        mimeType: 'application/json',
    },
    {
        uri: 'xray://examples/server-shadowsocks-2022',
        name: 'Server Shadowsocks 2022 Example',
        description: 'Example server configuration for Shadowsocks 2022',
        mimeType: 'application/json',
    },
];
// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case 'generate_server_config': {
                const input = GenerateServerConfigInputSchema.parse(args);
                const result = generateServerConfig(input);
                let response = `## Server Configuration Generated\n\n`;
                response += `**Protocol:** ${input.protocol.toUpperCase()}\n`;
                response += `**Port:** ${input.port}\n`;
                response += `**Transport:** ${input.transport}\n`;
                response += `**Security:** ${input.security}\n\n`;
                response += `### Users\n`;
                for (const user of result.users) {
                    response += `- **ID/Password:** \`${user.id}\`\n`;
                    if (user.email)
                        response += `  - Email: ${user.email}\n`;
                }
                if (result.realityKeys) {
                    response += `\n### REALITY Keys\n`;
                    response += `- **Private Key (server):** \`${result.realityKeys.privateKey}\`\n`;
                    response += `- **Public Key (client):** \`${result.realityKeys.publicKey}\`\n`;
                }
                response += `\n### Configuration\n\`\`\`json\n${JSON.stringify(result.config, null, 2)}\n\`\`\``;
                return {
                    content: [{ type: 'text', text: response }],
                };
            }
            case 'generate_client_config': {
                const input = GenerateClientConfigInputSchema.parse(args);
                const config = generateClientConfig(input);
                let response = `## Client Configuration Generated\n\n`;
                response += `**Server:** ${input.server_address}:${input.server_port}\n`;
                response += `**Protocol:** ${input.protocol.toUpperCase()}\n`;
                response += `**Transport:** ${input.transport}\n`;
                response += `**Security:** ${input.security}\n`;
                response += `**Local SOCKS Port:** ${input.socks_port}\n`;
                if (input.http_port)
                    response += `**Local HTTP Port:** ${input.http_port}\n`;
                response += `\n### Configuration\n\`\`\`json\n${JSON.stringify(config, null, 2)}\n\`\`\``;
                return {
                    content: [{ type: 'text', text: response }],
                };
            }
            case 'generate_uuid': {
                const uuid = generateUUID();
                return {
                    content: [{ type: 'text', text: `Generated UUID: \`${uuid}\`` }],
                };
            }
            case 'generate_x25519_keypair': {
                const keys = generateX25519KeyPair();
                return {
                    content: [{
                            type: 'text',
                            text: `## X25519 Key Pair Generated\n\n` +
                                `**Private Key (for server):**\n\`${keys.privateKey}\`\n\n` +
                                `**Public Key (for client):**\n\`${keys.publicKey}\`\n\n` +
                                `> Keep the private key secure and never share it!`,
                        }],
                };
            }
            case 'generate_short_id': {
                const length = args.length ?? 8;
                const shortId = generateShortId(length);
                return {
                    content: [{ type: 'text', text: `Generated Short ID: \`${shortId}\`` }],
                };
            }
            case 'generate_password': {
                const length = args.length ?? 16;
                const password = generatePassword(length);
                return {
                    content: [{ type: 'text', text: `Generated Password: \`${password}\`` }],
                };
            }
            case 'generate_ss2022_key': {
                const cipher = args.cipher ?? '2022-blake3-aes-256-gcm';
                const key = generateShadowsocks2022Key(cipher);
                return {
                    content: [{
                            type: 'text',
                            text: `## Shadowsocks 2022 Key Generated\n\n` +
                                `**Cipher:** ${cipher}\n` +
                                `**Key:** \`${key}\``,
                        }],
                };
            }
            case 'validate_config': {
                const config = args.config;
                const result = validateConfig(config);
                return {
                    content: [{ type: 'text', text: formatValidationResult(result) }],
                };
            }
            case 'list_protocols': {
                let response = '## Supported Protocols\n\n';
                for (const [key, info] of Object.entries(PROTOCOL_INFO)) {
                    response += `### ${info.name}\n`;
                    response += `- **Description:** ${info.description}\n`;
                    response += `- **Authentication:** ${info.authType}\n`;
                    response += `- **Supports Flow:** ${info.supportsFlow ? 'Yes' : 'No'}\n\n`;
                }
                return {
                    content: [{ type: 'text', text: response }],
                };
            }
            case 'list_transports': {
                let response = '## Supported Transports\n\n';
                for (const [key, info] of Object.entries(TRANSPORT_INFO)) {
                    response += `### ${info.name}\n`;
                    response += `- **Description:** ${info.description}\n`;
                    response += `- **Supports REALITY:** ${info.supportsReality ? 'Yes' : 'No'}\n\n`;
                }
                return {
                    content: [{ type: 'text', text: response }],
                };
            }
            case 'list_security': {
                let response = '## Supported Security Types\n\n';
                for (const [key, info] of Object.entries(SECURITY_INFO)) {
                    response += `### ${info.name}\n`;
                    response += `- **Description:** ${info.description}\n`;
                    response += `- **Requires Certificate:** ${info.requiresCert ? 'Yes' : 'No'}\n\n`;
                }
                return {
                    content: [{ type: 'text', text: response }],
                };
            }
            case 'list_reality_targets': {
                let response = '## Recommended REALITY Target Sites\n\n';
                for (const target of REALITY_TARGETS) {
                    response += `- **${target.domain}** - ${target.description}\n`;
                }
                response += '\n> Choose a target site that is fast and stable in your region.';
                return {
                    content: [{ type: 'text', text: response }],
                };
            }
            default:
                throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
    }
    catch (error) {
        if (error instanceof McpError)
            throw error;
        const message = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: 'text', text: `Error: ${message}` }],
            isError: true,
        };
    }
});
// Handle list resources request
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return { resources: RESOURCES };
});
// Handle read resource request
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    // Get the resource path from URI
    const resourcePath = uri.replace('xray://', '');
    // Determine file path
    let filePath;
    let mimeType;
    if (resourcePath.startsWith('docs/')) {
        const docName = resourcePath.replace('docs/', '');
        filePath = path.join(__dirname, '..', 'resources', 'docs', `${docName}.md`);
        mimeType = 'text/markdown';
    }
    else if (resourcePath.startsWith('examples/')) {
        const exampleName = resourcePath.replace('examples/', '');
        filePath = path.join(__dirname, '..', 'resources', 'examples', `${exampleName}.json`);
        mimeType = 'application/json';
    }
    else {
        throw new McpError(ErrorCode.InvalidRequest, `Unknown resource: ${uri}`);
    }
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return {
            contents: [{
                    uri,
                    mimeType,
                    text: content,
                }],
        };
    }
    catch (error) {
        throw new McpError(ErrorCode.InternalError, `Failed to read resource: ${uri}`);
    }
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Xray MCP Server started');
}
main().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map