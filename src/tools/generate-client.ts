import { z } from 'zod';

// Simple config types for flexibility
export interface SimpleXrayConfig {
  log?: {
    loglevel?: string;
    access?: string;
    error?: string;
  };
  dns?: Record<string, unknown>;
  routing?: Record<string, unknown>;
  inbounds: Array<Record<string, unknown>>;
  outbounds: Array<Record<string, unknown>>;
  policy?: Record<string, unknown>;
  stats?: Record<string, unknown>;
}

// Input schema for generate_client_config tool
export const GenerateClientConfigInputSchema = z.object({
  // Server connection info
  server_address: z.string().describe('Server address (IP or domain)'),
  server_port: z.number().int().min(1).max(65535).describe('Server port'),
  protocol: z.enum(['vless', 'vmess', 'trojan', 'shadowsocks']).describe('Protocol type'),
  
  // Authentication
  uuid: z.string().optional().describe('User UUID (for VLESS/VMess)'),
  password: z.string().optional().describe('Password (for Trojan/Shadowsocks)'),
  
  // Transport
  transport: z.enum(['tcp', 'ws', 'grpc', 'xhttp']).default('tcp').describe('Transport layer'),
  
  // Security
  security: z.enum(['none', 'tls', 'reality']).default('none').describe('Security layer'),
  
  // TLS options
  tls_server_name: z.string().optional().describe('TLS server name (SNI)'),
  tls_allow_insecure: z.boolean().default(false).describe('Allow insecure TLS connections'),
  tls_fingerprint: z.enum([
    'chrome', 'firefox', 'safari', 'ios', 'android', 'edge', 'qq', '360', 'random', 'randomized',
  ]).optional().describe('TLS fingerprint'),
  tls_alpn: z.array(z.string()).optional().describe('TLS ALPN protocols'),
  
  // REALITY options
  reality_public_key: z.string().optional().describe('REALITY public key'),
  reality_short_id: z.string().optional().describe('REALITY short ID'),
  reality_server_name: z.string().optional().describe('REALITY server name'),
  reality_fingerprint: z.enum([
    'chrome', 'firefox', 'safari', 'ios', 'android', 'edge', 'qq', '360', 'random', 'randomized',
  ]).default('chrome').describe('REALITY fingerprint'),
  reality_spider_x: z.string().optional().describe('REALITY spider X path'),
  
  // Transport options
  ws_path: z.string().optional().describe('WebSocket path'),
  ws_host: z.string().optional().describe('WebSocket host header'),
  grpc_service_name: z.string().optional().describe('gRPC service name'),
  xhttp_path: z.string().optional().describe('XHTTP path'),
  xhttp_host: z.string().optional().describe('XHTTP host header'),
  
  // VLESS specific
  vless_flow: z.enum(['', 'xtls-rprx-vision']).optional().describe('VLESS flow control'),
  vless_encryption: z.string().default('none').describe('VLESS encryption'),
  
  // VMess specific
  vmess_security: z.enum(['auto', 'aes-128-gcm', 'chacha20-poly1305', 'none', 'zero']).default('auto').describe('VMess security'),
  
  // Shadowsocks specific
  ss_method: z.enum([
    'aes-128-gcm', 'aes-256-gcm', 'chacha20-poly1305', 'xchacha20-poly1305',
    '2022-blake3-aes-128-gcm', '2022-blake3-aes-256-gcm', '2022-blake3-chacha20-poly1305',
  ]).optional().describe('Shadowsocks encryption method'),
  
  // Local proxy settings
  socks_port: z.number().int().min(1).max(65535).default(1080).describe('Local SOCKS5 proxy port'),
  http_port: z.number().int().min(1).max(65535).optional().describe('Local HTTP proxy port'),
  listen_address: z.string().default('127.0.0.1').describe('Local listen address'),
  
  // Routing options
  routing_mode: z.enum(['global', 'bypass_cn', 'bypass_lan', 'bypass_lan_cn', 'custom']).default('global').describe('Routing mode'),
  
  // DNS options
  enable_dns: z.boolean().default(true).describe('Enable DNS configuration'),
  dns_servers: z.array(z.string()).optional().describe('Custom DNS servers'),
  
  // Mux options
  enable_mux: z.boolean().default(false).describe('Enable multiplexing'),
  mux_concurrency: z.number().int().min(-1).max(1024).default(8).describe('Mux concurrency'),
  
  // Logging
  log_level: z.enum(['debug', 'info', 'warning', 'error', 'none']).default('warning').describe('Log level'),
});

export type GenerateClientConfigInput = z.infer<typeof GenerateClientConfigInputSchema>;

/**
 * Generate Xray client configuration
 */
export function generateClientConfig(input: GenerateClientConfigInput): SimpleXrayConfig {
  // Validate required authentication
  validateAuth(input);
  
  // Validate security settings
  validateSecurity(input);
  
  // Build inbounds (local proxy)
  const inbounds = buildInbounds(input);
  
  // Build outbounds (proxy and direct)
  const outbounds = buildOutbounds(input);
  
  // Build config
  const config: SimpleXrayConfig = {
    log: {
      loglevel: input.log_level,
    },
    inbounds,
    outbounds,
  };
  
  // Add routing
  config.routing = buildRouting(input);
  
  // Add DNS if enabled
  if (input.enable_dns) {
    config.dns = buildDns(input);
  }
  
  return config;
}

function validateAuth(input: GenerateClientConfigInput): void {
  if (input.protocol === 'vless' || input.protocol === 'vmess') {
    if (!input.uuid) {
      throw new Error(`${input.protocol.toUpperCase()} requires uuid parameter`);
    }
  } else if (input.protocol === 'trojan' || input.protocol === 'shadowsocks') {
    if (!input.password) {
      throw new Error(`${input.protocol.charAt(0).toUpperCase() + input.protocol.slice(1)} requires password parameter`);
    }
  }
}

function validateSecurity(input: GenerateClientConfigInput): void {
  if (input.security === 'reality') {
    if (!input.reality_public_key) {
      throw new Error('REALITY requires reality_public_key parameter');
    }
    if (!['tcp', 'grpc', 'xhttp'].includes(input.transport)) {
      throw new Error('REALITY only supports TCP, gRPC, and XHTTP transports');
    }
  }
}

function buildInbounds(input: GenerateClientConfigInput): Array<Record<string, unknown>> {
  const inbounds: Array<Record<string, unknown>> = [];
  
  // SOCKS5 inbound
  inbounds.push({
    tag: 'socks-in',
    port: input.socks_port,
    listen: input.listen_address,
    protocol: 'socks',
    settings: {
      auth: 'noauth',
      udp: true,
    },
    sniffing: {
      enabled: true,
      destOverride: ['http', 'tls'],
      routeOnly: false,
    },
  });
  
  // HTTP inbound (optional)
  if (input.http_port) {
    inbounds.push({
      tag: 'http-in',
      port: input.http_port,
      listen: input.listen_address,
      protocol: 'http',
      settings: {
        allowTransparent: false,
      },
      sniffing: {
        enabled: true,
        destOverride: ['http', 'tls'],
        routeOnly: false,
      },
    });
  }
  
  return inbounds;
}

function buildOutbounds(input: GenerateClientConfigInput): Array<Record<string, unknown>> {
  const outbounds: Array<Record<string, unknown>> = [];
  
  // Proxy outbound
  const proxyOutbound: Record<string, unknown> = {
    tag: 'proxy',
    protocol: input.protocol,
    settings: buildProtocolSettings(input),
    streamSettings: buildStreamSettings(input),
  };
  
  // Add mux if enabled
  if (input.enable_mux) {
    proxyOutbound.mux = {
      enabled: true,
      concurrency: input.mux_concurrency,
    };
  }
  
  outbounds.push(proxyOutbound);
  
  // Direct outbound
  outbounds.push({
    tag: 'direct',
    protocol: 'freedom',
    settings: {
      domainStrategy: 'UseIP',
    },
  });
  
  // Block outbound
  outbounds.push({
    tag: 'block',
    protocol: 'blackhole',
    settings: {
      response: {
        type: 'http',
      },
    },
  });
  
  return outbounds;
}

function buildProtocolSettings(input: GenerateClientConfigInput): Record<string, unknown> {
  switch (input.protocol) {
    case 'vless':
      return {
        address: input.server_address,
        port: input.server_port,
        id: input.uuid,
        flow: input.vless_flow || (input.security === 'reality' ? 'xtls-rprx-vision' : ''),
        encryption: input.vless_encryption,
      };
    
    case 'vmess':
      return {
        address: input.server_address,
        port: input.server_port,
        id: input.uuid,
        security: input.vmess_security,
      };
    
    case 'trojan':
      return {
        address: input.server_address,
        port: input.server_port,
        password: input.password,
      };
    
    case 'shadowsocks':
      return {
        address: input.server_address,
        port: input.server_port,
        method: input.ss_method || 'aes-256-gcm',
        password: input.password,
      };
    
    default:
      throw new Error(`Unsupported protocol: ${input.protocol}`);
  }
}

function buildStreamSettings(input: GenerateClientConfigInput): Record<string, unknown> {
  const streamSettings: Record<string, unknown> = {
    network: input.transport,
  };
  
  // Security settings
  if (input.security === 'tls') {
    streamSettings.security = 'tls';
    streamSettings.tlsSettings = {
      serverName: input.tls_server_name || input.server_address,
      allowInsecure: input.tls_allow_insecure,
      fingerprint: input.tls_fingerprint || 'chrome',
      alpn: input.tls_alpn || ['h2', 'http/1.1'],
    };
  } else if (input.security === 'reality') {
    streamSettings.security = 'reality';
    streamSettings.realitySettings = {
      serverName: input.reality_server_name || input.server_address,
      fingerprint: input.reality_fingerprint,
      publicKey: input.reality_public_key,
      shortId: input.reality_short_id || '',
      spiderX: input.reality_spider_x || '/',
    };
  } else {
    streamSettings.security = 'none';
  }
  
  // Transport settings
  switch (input.transport) {
    case 'ws':
      streamSettings.wsSettings = {
        path: input.ws_path || '/',
        host: input.ws_host || input.server_address,
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
        host: input.xhttp_host || input.server_address,
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

function buildRouting(input: GenerateClientConfigInput): Record<string, unknown> {
  const rules: Array<Record<string, unknown>> = [];
  
  switch (input.routing_mode) {
    case 'bypass_lan':
      rules.push({
        type: 'field',
        ip: ['geoip:private'],
        outboundTag: 'direct',
      });
      break;
    
    case 'bypass_cn':
      rules.push({
        type: 'field',
        domain: ['geosite:cn'],
        outboundTag: 'direct',
      });
      rules.push({
        type: 'field',
        ip: ['geoip:cn', 'geoip:private'],
        outboundTag: 'direct',
      });
      break;
    
    case 'bypass_lan_cn':
      rules.push({
        type: 'field',
        domain: ['geosite:cn'],
        outboundTag: 'direct',
      });
      rules.push({
        type: 'field',
        ip: ['geoip:cn', 'geoip:private'],
        outboundTag: 'direct',
      });
      break;
    
    case 'global':
    default:
      // All traffic goes through proxy
      break;
  }
  
  // Block ads (optional enhancement)
  rules.push({
    type: 'field',
    domain: ['geosite:category-ads-all'],
    outboundTag: 'block',
  });
  
  return {
    domainStrategy: 'IPIfNonMatch',
    rules,
  };
}

function buildDns(input: GenerateClientConfigInput): Record<string, unknown> {
  const servers = input.dns_servers || ['8.8.8.8', '1.1.1.1'];
  
  const dnsConfig: Record<string, unknown> = {
    servers,
    queryStrategy: 'UseIP',
  };
  
  // Add China DNS for bypass_cn modes
  if (input.routing_mode === 'bypass_cn' || input.routing_mode === 'bypass_lan_cn') {
    dnsConfig.servers = [
      ...servers,
      {
        address: '114.114.114.114',
        port: 53,
        domains: ['geosite:cn'],
        expectIPs: ['geoip:cn'],
      },
    ];
  }
  
  return dnsConfig;
}
