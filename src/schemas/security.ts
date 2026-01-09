import { z } from 'zod';

// Security types
export const SecurityType = z.enum(['none', 'tls', 'reality']);
export type SecurityType = z.infer<typeof SecurityType>;

// TLS certificate configuration
export const TlsCertificateSchema = z.object({
  certificateFile: z.string().optional(),
  certificate: z.array(z.string()).optional(),
  keyFile: z.string().optional(),
  key: z.array(z.string()).optional(),
  usage: z.enum(['encipherment', 'verify', 'issue']).default('encipherment'),
  ocspStapling: z.number().int().min(0).optional(),
  oneTimeLoading: z.boolean().optional(),
  buildChain: z.boolean().optional(),
});

// TLS settings (for server)
export const TlsServerSettingsSchema = z.object({
  serverName: z.string().optional(),
  alpn: z.array(z.string()).default(['h2', 'http/1.1']),
  certificates: z.array(TlsCertificateSchema).optional(),
  minVersion: z.string().optional(),
  maxVersion: z.string().optional(),
  cipherSuites: z.string().optional(),
  rejectUnknownSni: z.boolean().default(false),
  fingerprint: z.string().optional(),
});

// TLS settings (for client)
export const TlsClientSettingsSchema = z.object({
  serverName: z.string().optional(),
  alpn: z.array(z.string()).optional(),
  allowInsecure: z.boolean().default(false),
  disableSystemRoot: z.boolean().default(false),
  fingerprint: z.enum([
    'chrome', 'firefox', 'safari', 'ios', 'android', 'edge',
    'qq', '360', 'random', 'randomized',
  ]).optional(),
  pinnedPeerCertificateChainSha256: z.array(z.string()).optional(),
  pinnedPeerCertificatePublicKeySha256: z.array(z.string()).optional(),
});

// REALITY settings (for server)
export const RealityServerSettingsSchema = z.object({
  show: z.boolean().default(false),
  dest: z.union([z.string(), z.number()]),
  xver: z.number().int().min(0).max(2).default(0),
  serverNames: z.array(z.string()).min(1),
  privateKey: z.string().min(1),
  shortIds: z.array(z.string()).min(1),
  minClientVer: z.string().optional(),
  maxClientVer: z.string().optional(),
  maxTimeDiff: z.number().int().min(0).default(0),
});

// REALITY settings (for client)
export const RealityClientSettingsSchema = z.object({
  serverName: z.string().optional(),
  fingerprint: z.enum([
    'chrome', 'firefox', 'safari', 'ios', 'android', 'edge',
    'qq', '360', 'random', 'randomized',
  ]).default('chrome'),
  publicKey: z.string().min(1),
  shortId: z.string().default(''),
  spiderX: z.string().optional(),
});

// Common fingerprints
export const FINGERPRINTS = [
  'chrome',
  'firefox',
  'safari',
  'ios',
  'android',
  'edge',
  'qq',
  '360',
  'random',
  'randomized',
] as const;

// Security info for documentation
export const SECURITY_INFO = {
  none: {
    name: 'None',
    description: 'No encryption, use only for local or already encrypted connections',
    requiresCert: false,
  },
  tls: {
    name: 'TLS',
    description: 'Standard TLS encryption, requires valid certificate',
    requiresCert: true,
  },
  reality: {
    name: 'REALITY',
    description: 'Advanced TLS camouflage technology, no certificate needed',
    requiresCert: false,
  },
} as const;

// Common REALITY target sites
export const REALITY_TARGETS = [
  { domain: 'www.microsoft.com', description: 'Microsoft (recommended)' },
  { domain: 'www.apple.com', description: 'Apple' },
  { domain: 'www.amazon.com', description: 'Amazon' },
  { domain: 'www.cloudflare.com', description: 'Cloudflare' },
  { domain: 'www.google.com', description: 'Google' },
  { domain: 'www.yahoo.com', description: 'Yahoo' },
  { domain: 'www.bing.com', description: 'Bing' },
  { domain: 'www.github.com', description: 'GitHub' },
] as const;
