import { z } from 'zod';
import { generateUUID, generateX25519KeyPair, generateShortId, generatePassword, generateShadowsocks2022Key } from '../utils/crypto.js';
// Input schema for generate_server_config tool
export const GenerateServerConfigInputSchema = z.object({
    protocol: z.enum(['vless', 'vmess', 'trojan', 'shadowsocks']).describe('Protocol type'),
    port: z.number().int().min(1).max(65535).describe('Server listening port'),
    transport: z.enum(['tcp', 'ws', 'grpc', 'xhttp']).default('tcp').describe('Transport layer'),
    security: z.enum(['none', 'tls', 'reality']).default('none').describe('Security layer'),
    // TLS options
    tls_cert_file: z.string().optional().describe('TLS certificate file path'),
    tls_key_file: z.string().optional().describe('TLS private key file path'),
    tls_server_name: z.string().optional().describe('TLS server name'),
    // REALITY options
    reality_dest: z.string().optional().describe('REALITY target destination (e.g., www.microsoft.com:443)'),
    reality_server_names: z.array(z.string()).optional().describe('REALITY server names'),
    reality_private_key: z.string().optional().describe('REALITY private key (auto-generated if not provided)'),
    reality_short_ids: z.array(z.string()).optional().describe('REALITY short IDs (auto-generated if not provided)'),
    // Transport options
    ws_path: z.string().optional().describe('WebSocket path'),
    ws_host: z.string().optional().describe('WebSocket host header'),
    grpc_service_name: z.string().optional().describe('gRPC service name'),
    xhttp_path: z.string().optional().describe('XHTTP path'),
    xhttp_host: z.string().optional().describe('XHTTP host header'),
    // User options
    users: z.array(z.object({
        id: z.string().optional().describe('User UUID (for VLESS/VMess) or password (for Trojan/Shadowsocks)'),
        email: z.string().optional().describe('User email for identification'),
        level: z.number().int().min(0).optional().describe('User level'),
    })).optional().describe('User list (auto-generated if not provided)'),
    // Shadowsocks specific
    ss_method: z.enum([
        'aes-128-gcm', 'aes-256-gcm', 'chacha20-poly1305', 'xchacha20-poly1305',
        '2022-blake3-aes-128-gcm', '2022-blake3-aes-256-gcm', '2022-blake3-chacha20-poly1305',
    ]).optional().describe('Shadowsocks encryption method'),
    // VLESS specific
    vless_flow: z.enum(['', 'xtls-rprx-vision']).optional().describe('VLESS flow control'),
    // Fallback
    fallback_dest: z.union([z.string(), z.number()]).optional().describe('Fallback destination'),
    // Routing
    enable_routing: z.boolean().default(false).describe('Enable basic routing rules'),
    block_ads: z.boolean().default(false).describe('Block advertisement domains'),
    block_cn: z.boolean().default(false).describe('Block connections to China'),
    // DNS
    enable_dns: z.boolean().default(false).describe('Enable DNS configuration'),
    // Logging
    log_level: z.enum(['debug', 'info', 'warning', 'error', 'none']).default('warning').describe('Log level'),
});
/**
 * Generate Xray server configuration
 */
export function generateServerConfig(input) {
    // Validate security + transport combination
    if (input.security === 'reality') {
        if (!['tcp', 'grpc', 'xhttp'].includes(input.transport)) {
            throw new Error('REALITY only supports TCP, gRPC, and XHTTP transports');
        }
        if (!input.reality_dest) {
            throw new Error('REALITY requires reality_dest parameter');
        }
    }
    if (input.security === 'tls') {
        if (!input.tls_cert_file || !input.tls_key_file) {
            throw new Error('TLS requires tls_cert_file and tls_key_file parameters');
        }
    }
    // Generate users if not provided
    const users = generateUsers(input);
    // Generate REALITY keys if needed
    let realityKeys;
    if (input.security === 'reality') {
        if (input.reality_private_key) {
            realityKeys = {
                privateKey: input.reality_private_key,
                publicKey: '(provide your public key)',
            };
        }
        else {
            realityKeys = generateX25519KeyPair();
        }
    }
    // Build inbound configuration
    const inbound = buildInbound(input, users, realityKeys);
    // Build outbounds
    const outbounds = buildOutbounds();
    // Build config
    const config = {
        log: {
            loglevel: input.log_level,
        },
        inbounds: [inbound],
        outbounds,
    };
    // Add routing if enabled
    if (input.enable_routing || input.block_ads || input.block_cn) {
        config.routing = buildRouting(input);
    }
    // Add DNS if enabled
    if (input.enable_dns) {
        config.dns = buildDns();
    }
    return { config, users, realityKeys };
}
function generateUsers(input) {
    if (input.users && input.users.length > 0) {
        return input.users.map((user, index) => {
            let id;
            if (user.id) {
                id = user.id;
            }
            else if (input.protocol === 'vless' || input.protocol === 'vmess') {
                id = generateUUID();
            }
            else if (input.protocol === 'shadowsocks' && input.ss_method?.startsWith('2022-')) {
                id = generateShadowsocks2022Key(input.ss_method);
            }
            else {
                id = generatePassword();
            }
            return {
                id,
                email: user.email || `user${index + 1}@xray.mcp`,
                level: user.level ?? 0,
            };
        });
    }
    // Generate single default user
    let id;
    if (input.protocol === 'vless' || input.protocol === 'vmess') {
        id = generateUUID();
    }
    else if (input.protocol === 'shadowsocks' && input.ss_method?.startsWith('2022-')) {
        id = generateShadowsocks2022Key(input.ss_method);
    }
    else {
        id = generatePassword();
    }
    return [{ id, email: 'user@xray.mcp', level: 0 }];
}
function buildInbound(input, users, realityKeys) {
    const inbound = {
        tag: 'inbound-main',
        port: input.port,
        listen: '0.0.0.0',
        protocol: input.protocol,
        settings: buildProtocolSettings(input, users),
        sniffing: {
            enabled: true,
            destOverride: ['http', 'tls'],
        },
    };
    // Add stream settings
    inbound.streamSettings = buildStreamSettings(input, realityKeys);
    return inbound;
}
function buildProtocolSettings(input, users) {
    switch (input.protocol) {
        case 'vless': {
            const clients = users.map(user => ({
                id: user.id,
                flow: input.vless_flow || (input.security === 'reality' ? 'xtls-rprx-vision' : ''),
                level: user.level ?? 0,
                email: user.email,
            }));
            const settings = {
                clients,
                decryption: 'none',
            };
            if (input.fallback_dest) {
                settings.fallbacks = [{ dest: input.fallback_dest }];
            }
            return settings;
        }
        case 'vmess': {
            const clients = users.map(user => ({
                id: user.id,
                level: user.level ?? 0,
                email: user.email,
            }));
            return { clients };
        }
        case 'trojan': {
            const clients = users.map(user => ({
                password: user.id,
                level: user.level ?? 0,
                email: user.email,
            }));
            const settings = { clients };
            if (input.fallback_dest) {
                settings.fallbacks = [{ dest: input.fallback_dest }];
            }
            return settings;
        }
        case 'shadowsocks': {
            const method = input.ss_method || 'aes-256-gcm';
            if (method.startsWith('2022-')) {
                // Shadowsocks 2022
                if (users.length === 1) {
                    return {
                        method,
                        password: users[0].id,
                        network: 'tcp,udp',
                    };
                }
                else {
                    return {
                        method,
                        password: generateShadowsocks2022Key(method), // Server key
                        clients: users.map(user => ({
                            password: user.id,
                            email: user.email,
                        })),
                        network: 'tcp,udp',
                    };
                }
            }
            else {
                // Legacy Shadowsocks
                if (users.length === 1) {
                    return {
                        method,
                        password: users[0].id,
                        network: 'tcp,udp',
                    };
                }
                else {
                    return {
                        clients: users.map(user => ({
                            method,
                            password: user.id,
                            email: user.email,
                            level: user.level ?? 0,
                        })),
                        network: 'tcp,udp',
                    };
                }
            }
        }
        default:
            throw new Error(`Unsupported protocol: ${input.protocol}`);
    }
}
function buildStreamSettings(input, realityKeys) {
    const streamSettings = {
        network: input.transport,
    };
    // Security settings
    if (input.security === 'tls') {
        streamSettings.security = 'tls';
        streamSettings.tlsSettings = {
            certificates: [{
                    certificateFile: input.tls_cert_file,
                    keyFile: input.tls_key_file,
                }],
            alpn: ['h2', 'http/1.1'],
        };
        if (input.tls_server_name) {
            streamSettings.tlsSettings.serverName = input.tls_server_name;
        }
    }
    else if (input.security === 'reality' && realityKeys) {
        streamSettings.security = 'reality';
        const shortIds = input.reality_short_ids && input.reality_short_ids.length > 0
            ? input.reality_short_ids
            : [generateShortId(8), generateShortId(4), ''];
        const serverNames = input.reality_server_names && input.reality_server_names.length > 0
            ? input.reality_server_names
            : [input.reality_dest.split(':')[0]];
        streamSettings.realitySettings = {
            show: false,
            dest: input.reality_dest,
            xver: 0,
            serverNames,
            privateKey: realityKeys.privateKey,
            shortIds,
        };
    }
    else {
        streamSettings.security = 'none';
    }
    // Transport settings
    switch (input.transport) {
        case 'ws':
            streamSettings.wsSettings = {
                path: input.ws_path || '/',
                host: input.ws_host,
            };
            break;
        case 'grpc':
            streamSettings.grpcSettings = {
                serviceName: input.grpc_service_name || '',
                multiMode: true,
            };
            break;
        case 'xhttp':
            streamSettings.xhttpSettings = {
                path: input.xhttp_path || '/',
                host: input.xhttp_host,
                mode: 'auto',
            };
            break;
        case 'tcp':
        default:
            // No additional settings needed for TCP
            break;
    }
    return streamSettings;
}
function buildOutbounds() {
    return [
        {
            tag: 'direct',
            protocol: 'freedom',
            settings: {},
        },
        {
            tag: 'block',
            protocol: 'blackhole',
            settings: {
                response: {
                    type: 'http',
                },
            },
        },
    ];
}
function buildRouting(input) {
    const rules = [];
    // Block ads
    if (input.block_ads) {
        rules.push({
            type: 'field',
            domain: ['geosite:category-ads-all'],
            outboundTag: 'block',
        });
    }
    // Block China
    if (input.block_cn) {
        rules.push({
            type: 'field',
            domain: ['geosite:cn'],
            outboundTag: 'block',
        });
        rules.push({
            type: 'field',
            ip: ['geoip:cn'],
            outboundTag: 'block',
        });
    }
    // Default rule
    rules.push({
        type: 'field',
        network: 'tcp,udp',
        outboundTag: 'direct',
    });
    return {
        domainStrategy: 'AsIs',
        rules,
    };
}
function buildDns() {
    return {
        servers: [
            '8.8.8.8',
            '1.1.1.1',
            {
                address: '114.114.114.114',
                port: 53,
                domains: ['geosite:cn'],
            },
        ],
        queryStrategy: 'UseIP',
    };
}
//# sourceMappingURL=generate-server.js.map