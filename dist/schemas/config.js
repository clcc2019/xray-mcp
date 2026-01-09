import { z } from 'zod';
// Log configuration
export const LogConfigSchema = z.object({
    access: z.string().optional(),
    error: z.string().optional(),
    loglevel: z.enum(['debug', 'info', 'warning', 'error', 'none']).optional(),
    dnsLog: z.boolean().optional(),
});
// Sniffing configuration
export const SniffingConfigSchema = z.object({
    enabled: z.boolean().optional(),
    destOverride: z.array(z.string()).optional(),
    metadataOnly: z.boolean().optional(),
    routeOnly: z.boolean().optional(),
    domainsExcluded: z.array(z.string()).optional(),
});
// Inbound configuration
export const InboundConfigSchema = z.object({
    tag: z.string().optional(),
    port: z.union([z.number().int().min(1).max(65535), z.string()]),
    listen: z.string().optional(),
    protocol: z.string(),
    settings: z.any(),
    streamSettings: z.record(z.string(), z.unknown()).optional(),
    sniffing: SniffingConfigSchema.optional(),
});
// Outbound configuration
export const OutboundConfigSchema = z.object({
    tag: z.string().optional(),
    protocol: z.string(),
    settings: z.any(),
    streamSettings: z.record(z.string(), z.unknown()).optional(),
    mux: z.object({
        enabled: z.boolean().optional(),
        concurrency: z.number().int().min(-1).optional(),
        xudpConcurrency: z.number().int().optional(),
        xudpProxyUDP443: z.enum(['reject', 'allow', 'skip']).optional(),
    }).optional(),
});
// Routing rule
export const RoutingRuleSchema = z.object({
    ruleTag: z.string().optional(),
    type: z.string().optional(),
    domain: z.array(z.string()).optional(),
    ip: z.array(z.string()).optional(),
    port: z.union([z.string(), z.number()]).optional(),
    sourcePort: z.union([z.string(), z.number()]).optional(),
    network: z.string().optional(),
    source: z.array(z.string()).optional(),
    user: z.array(z.string()).optional(),
    inboundTag: z.array(z.string()).optional(),
    protocol: z.array(z.string()).optional(),
    attrs: z.record(z.string(), z.string()).optional(),
    outboundTag: z.string().optional(),
    balancerTag: z.string().optional(),
});
// Routing configuration
export const RoutingConfigSchema = z.object({
    domainStrategy: z.string().optional(),
    domainMatcher: z.string().optional(),
    rules: z.array(RoutingRuleSchema).optional(),
    balancers: z.array(z.object({
        tag: z.string(),
        selector: z.array(z.string()),
        strategy: z.object({
            type: z.string().optional(),
        }).optional(),
    })).optional(),
});
// DNS server configuration
export const DnsServerSchema = z.union([
    z.string(),
    z.object({
        address: z.string(),
        port: z.number().int().min(1).max(65535).optional(),
        domains: z.array(z.string()).optional(),
        expectedIPs: z.array(z.string()).optional(),
        expectIPs: z.array(z.string()).optional(),
        skipFallback: z.boolean().optional(),
        clientIp: z.string().optional(),
        queryStrategy: z.string().optional(),
    }),
]);
// DNS configuration
export const DnsConfigSchema = z.object({
    hosts: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
    servers: z.array(DnsServerSchema).optional(),
    clientIp: z.string().optional(),
    queryStrategy: z.string().optional(),
    disableCache: z.boolean().optional(),
    disableFallback: z.boolean().optional(),
    disableFallbackIfMatch: z.boolean().optional(),
    tag: z.string().optional(),
});
// Policy levels
export const PolicyLevelSchema = z.object({
    handshake: z.number().int().optional(),
    connIdle: z.number().int().optional(),
    uplinkOnly: z.number().int().optional(),
    downlinkOnly: z.number().int().optional(),
    statsUserUplink: z.boolean().optional(),
    statsUserDownlink: z.boolean().optional(),
    bufferSize: z.number().int().optional(),
});
// Policy configuration
export const PolicyConfigSchema = z.object({
    levels: z.record(z.string(), PolicyLevelSchema).optional(),
    system: z.object({
        statsInboundUplink: z.boolean().optional(),
        statsInboundDownlink: z.boolean().optional(),
        statsOutboundUplink: z.boolean().optional(),
        statsOutboundDownlink: z.boolean().optional(),
    }).optional(),
});
// Stats configuration
export const StatsConfigSchema = z.object({});
// API configuration
export const ApiConfigSchema = z.object({
    tag: z.string().optional(),
    services: z.array(z.string()).optional(),
});
// Full Xray configuration
export const XrayConfigSchema = z.object({
    log: LogConfigSchema.optional(),
    api: ApiConfigSchema.optional(),
    dns: DnsConfigSchema.optional(),
    routing: RoutingConfigSchema.optional(),
    policy: PolicyConfigSchema.optional(),
    inbounds: z.array(InboundConfigSchema).optional(),
    outbounds: z.array(OutboundConfigSchema).optional(),
    stats: StatsConfigSchema.optional(),
});
//# sourceMappingURL=config.js.map