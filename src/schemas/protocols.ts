import { z } from 'zod';

// Supported protocols
export const ProtocolType = z.enum(['vless', 'vmess', 'trojan', 'shadowsocks', 'socks', 'http']);
export type ProtocolType = z.infer<typeof ProtocolType>;

// VLESS user configuration
export const VLessUserSchema = z.object({
  id: z.string().uuid(),
  flow: z.enum(['', 'xtls-rprx-vision']).default(''),
  level: z.number().int().min(0).default(0),
  email: z.string().optional(),
});

// VLESS inbound settings
export const VLessInboundSettingsSchema = z.object({
  clients: z.array(VLessUserSchema).min(1),
  decryption: z.string().default('none'),
  fallbacks: z.array(z.object({
    dest: z.union([z.string(), z.number()]),
    path: z.string().optional(),
    xver: z.number().int().min(0).max(2).optional(),
    alpn: z.string().optional(),
  })).optional(),
});

// VLESS outbound settings
export const VLessOutboundSettingsSchema = z.object({
  address: z.string(),
  port: z.number().int().min(1).max(65535),
  id: z.string().uuid(),
  flow: z.enum(['', 'xtls-rprx-vision']).default(''),
  encryption: z.string().default('none'),
  level: z.number().int().min(0).default(0),
});

// VMess user configuration
export const VMessUserSchema = z.object({
  id: z.string().uuid(),
  security: z.enum(['auto', 'aes-128-gcm', 'chacha20-poly1305', 'none', 'zero']).default('auto'),
  level: z.number().int().min(0).default(0),
  email: z.string().optional(),
});

// VMess inbound settings
export const VMessInboundSettingsSchema = z.object({
  clients: z.array(VMessUserSchema).min(1),
});

// VMess outbound settings
export const VMessOutboundSettingsSchema = z.object({
  address: z.string(),
  port: z.number().int().min(1).max(65535),
  id: z.string().uuid(),
  security: z.enum(['auto', 'aes-128-gcm', 'chacha20-poly1305', 'none', 'zero']).default('auto'),
  level: z.number().int().min(0).default(0),
});

// Trojan user configuration
export const TrojanUserSchema = z.object({
  password: z.string().min(1),
  level: z.number().int().min(0).default(0),
  email: z.string().optional(),
});

// Trojan inbound settings
export const TrojanInboundSettingsSchema = z.object({
  clients: z.array(TrojanUserSchema).min(1),
  fallbacks: z.array(z.object({
    dest: z.union([z.string(), z.number()]),
    path: z.string().optional(),
    xver: z.number().int().min(0).max(2).optional(),
    alpn: z.string().optional(),
  })).optional(),
});

// Trojan outbound settings
export const TrojanOutboundSettingsSchema = z.object({
  address: z.string(),
  port: z.number().int().min(1).max(65535),
  password: z.string().min(1),
  level: z.number().int().min(0).default(0),
});

// Shadowsocks cipher types
export const ShadowsocksCipher = z.enum([
  'aes-128-gcm',
  'aes-256-gcm',
  'chacha20-poly1305',
  'xchacha20-poly1305',
  '2022-blake3-aes-128-gcm',
  '2022-blake3-aes-256-gcm',
  '2022-blake3-chacha20-poly1305',
  'none',
]);

// Shadowsocks user configuration
export const ShadowsocksUserSchema = z.object({
  password: z.string().min(1),
  method: ShadowsocksCipher,
  level: z.number().int().min(0).default(0),
  email: z.string().optional(),
});

// Shadowsocks inbound settings
export const ShadowsocksInboundSettingsSchema = z.object({
  password: z.string().optional(),
  method: ShadowsocksCipher.optional(),
  clients: z.array(ShadowsocksUserSchema).optional(),
  network: z.enum(['tcp', 'udp', 'tcp,udp']).default('tcp,udp'),
});

// Shadowsocks outbound settings
export const ShadowsocksOutboundSettingsSchema = z.object({
  address: z.string(),
  port: z.number().int().min(1).max(65535),
  password: z.string().min(1),
  method: ShadowsocksCipher,
  level: z.number().int().min(0).default(0),
});

// SOCKS inbound settings
export const SocksInboundSettingsSchema = z.object({
  auth: z.enum(['noauth', 'password']).default('noauth'),
  accounts: z.array(z.object({
    user: z.string(),
    pass: z.string(),
  })).optional(),
  udp: z.boolean().default(true),
});

// SOCKS outbound settings
export const SocksOutboundSettingsSchema = z.object({
  address: z.string(),
  port: z.number().int().min(1).max(65535),
  users: z.array(z.object({
    user: z.string(),
    pass: z.string(),
  })).optional(),
});

// HTTP inbound settings
export const HttpInboundSettingsSchema = z.object({
  accounts: z.array(z.object({
    user: z.string(),
    pass: z.string(),
  })).optional(),
  allowTransparent: z.boolean().default(false),
});

// HTTP outbound settings
export const HttpOutboundSettingsSchema = z.object({
  address: z.string(),
  port: z.number().int().min(1).max(65535),
  users: z.array(z.object({
    user: z.string(),
    pass: z.string(),
  })).optional(),
});

// Freedom outbound (direct connection)
export const FreedomOutboundSettingsSchema = z.object({
  domainStrategy: z.enum(['AsIs', 'UseIP', 'UseIPv4', 'UseIPv6']).default('AsIs'),
  redirect: z.string().optional(),
});

// Blackhole outbound (block connection)
export const BlackholeOutboundSettingsSchema = z.object({
  response: z.object({
    type: z.enum(['none', 'http']).default('none'),
  }).optional(),
});

// Protocol info for documentation
export const PROTOCOL_INFO = {
  vless: {
    name: 'VLESS',
    description: 'Lightweight protocol with optional XTLS Vision support for better performance',
    authType: 'uuid',
    supportsFlow: true,
  },
  vmess: {
    name: 'VMess',
    description: 'Classic V2Ray protocol with multiple encryption methods',
    authType: 'uuid',
    supportsFlow: false,
  },
  trojan: {
    name: 'Trojan',
    description: 'Protocol that disguises traffic as HTTPS',
    authType: 'password',
    supportsFlow: false,
  },
  shadowsocks: {
    name: 'Shadowsocks',
    description: 'Lightweight protocol supporting AEAD and 2022 ciphers',
    authType: 'password',
    supportsFlow: false,
  },
  socks: {
    name: 'SOCKS',
    description: 'Standard SOCKS5 proxy protocol',
    authType: 'optional',
    supportsFlow: false,
  },
  http: {
    name: 'HTTP',
    description: 'Standard HTTP proxy protocol',
    authType: 'optional',
    supportsFlow: false,
  },
} as const;
