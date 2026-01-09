import { z } from 'zod';
// Supported transport types
export const TransportType = z.enum(['tcp', 'ws', 'grpc', 'xhttp', 'mkcp', 'httpupgrade']);
// TCP settings
export const TcpSettingsSchema = z.object({
    acceptProxyProtocol: z.boolean().optional(),
    header: z.object({
        type: z.string().optional(),
        request: z.object({
            version: z.string().optional(),
            method: z.string().optional(),
            path: z.array(z.string()).optional(),
            headers: z.record(z.string(), z.unknown()).optional(),
        }).optional(),
        response: z.object({
            version: z.string().optional(),
            status: z.string().optional(),
            reason: z.string().optional(),
            headers: z.record(z.string(), z.unknown()).optional(),
        }).optional(),
    }).optional(),
});
// WebSocket settings
export const WsSettingsSchema = z.object({
    path: z.string().optional(),
    host: z.string().optional(),
    headers: z.record(z.string(), z.string()).optional(),
    acceptProxyProtocol: z.boolean().optional(),
    heartbeatPeriod: z.number().int().min(0).optional(),
});
// gRPC settings
export const GrpcSettingsSchema = z.object({
    serviceName: z.string().optional(),
    multiMode: z.boolean().optional(),
    idle_timeout: z.number().int().min(0).optional(),
    health_check_timeout: z.number().int().min(0).optional(),
    permit_without_stream: z.boolean().optional(),
    initial_windows_size: z.number().int().optional(),
});
// XHTTP (SplitHTTP) settings
export const XhttpSettingsSchema = z.object({
    path: z.string().optional(),
    host: z.string().optional(),
    headers: z.record(z.string(), z.string()).optional(),
    mode: z.string().optional(),
    noGRPCHeader: z.boolean().optional(),
    noSSEHeader: z.boolean().optional(),
    xPaddingBytes: z.object({
        from: z.number().int(),
        to: z.number().int(),
    }).optional(),
    xmux: z.object({
        maxConcurrency: z.object({
            from: z.number().int(),
            to: z.number().int(),
        }).optional(),
        maxConnections: z.object({
            from: z.number().int(),
            to: z.number().int(),
        }).optional(),
        cMaxReuseTimes: z.object({
            from: z.number().int(),
            to: z.number().int(),
        }).optional(),
        hMaxRequestTimes: z.object({
            from: z.number().int(),
            to: z.number().int(),
        }).optional(),
    }).optional(),
});
// mKCP settings
export const KcpSettingsSchema = z.object({
    mtu: z.number().int().min(576).max(1460).optional(),
    tti: z.number().int().min(10).max(100).optional(),
    uplinkCapacity: z.number().int().min(0).optional(),
    downlinkCapacity: z.number().int().min(0).optional(),
    congestion: z.boolean().optional(),
    readBufferSize: z.number().int().min(0).optional(),
    writeBufferSize: z.number().int().min(0).optional(),
    header: z.object({
        type: z.string().optional(),
    }).optional(),
    seed: z.string().optional(),
});
// HTTPUpgrade settings
export const HttpUpgradeSettingsSchema = z.object({
    path: z.string().optional(),
    host: z.string().optional(),
    headers: z.record(z.string(), z.string()).optional(),
    acceptProxyProtocol: z.boolean().optional(),
});
// Socket options
export const SocketSettingsSchema = z.object({
    mark: z.number().int().optional(),
    tcpFastOpen: z.union([z.boolean(), z.number().int()]).optional(),
    tproxy: z.string().optional(),
    domainStrategy: z.string().optional(),
    dialerProxy: z.string().optional(),
    acceptProxyProtocol: z.boolean().optional(),
    tcpKeepAliveInterval: z.number().int().optional(),
    tcpKeepAliveIdle: z.number().int().optional(),
    tcpCongestion: z.string().optional(),
    interface: z.string().optional(),
    tcpMptcp: z.boolean().optional(),
});
// Transport info for documentation
export const TRANSPORT_INFO = {
    tcp: {
        name: 'TCP/RAW',
        description: 'Raw TCP connection, lowest overhead',
        supportsReality: true,
    },
    ws: {
        name: 'WebSocket',
        description: 'WebSocket transport, good for CDN and reverse proxy',
        supportsReality: false,
    },
    grpc: {
        name: 'gRPC',
        description: 'gRPC transport, supports multiplexing',
        supportsReality: true,
    },
    xhttp: {
        name: 'XHTTP (SplitHTTP)',
        description: 'Next-generation HTTP transport with H2/H3 support',
        supportsReality: true,
    },
    mkcp: {
        name: 'mKCP',
        description: 'UDP-based transport with congestion control',
        supportsReality: false,
    },
    httpupgrade: {
        name: 'HTTPUpgrade',
        description: 'HTTP Upgrade transport',
        supportsReality: false,
    },
};
//# sourceMappingURL=transports.js.map