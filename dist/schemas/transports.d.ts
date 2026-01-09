import { z } from 'zod';
export declare const TransportType: z.ZodEnum<{
    tcp: "tcp";
    ws: "ws";
    grpc: "grpc";
    xhttp: "xhttp";
    mkcp: "mkcp";
    httpupgrade: "httpupgrade";
}>;
export type TransportType = z.infer<typeof TransportType>;
export declare const TcpSettingsSchema: z.ZodObject<{
    acceptProxyProtocol: z.ZodOptional<z.ZodBoolean>;
    header: z.ZodOptional<z.ZodObject<{
        type: z.ZodOptional<z.ZodString>;
        request: z.ZodOptional<z.ZodObject<{
            version: z.ZodOptional<z.ZodString>;
            method: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodArray<z.ZodString>>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        response: z.ZodOptional<z.ZodObject<{
            version: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodString>;
            reason: z.ZodOptional<z.ZodString>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const WsSettingsSchema: z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    host: z.ZodOptional<z.ZodString>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    acceptProxyProtocol: z.ZodOptional<z.ZodBoolean>;
    heartbeatPeriod: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const GrpcSettingsSchema: z.ZodObject<{
    serviceName: z.ZodOptional<z.ZodString>;
    multiMode: z.ZodOptional<z.ZodBoolean>;
    idle_timeout: z.ZodOptional<z.ZodNumber>;
    health_check_timeout: z.ZodOptional<z.ZodNumber>;
    permit_without_stream: z.ZodOptional<z.ZodBoolean>;
    initial_windows_size: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const XhttpSettingsSchema: z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    host: z.ZodOptional<z.ZodString>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    mode: z.ZodOptional<z.ZodString>;
    noGRPCHeader: z.ZodOptional<z.ZodBoolean>;
    noSSEHeader: z.ZodOptional<z.ZodBoolean>;
    xPaddingBytes: z.ZodOptional<z.ZodObject<{
        from: z.ZodNumber;
        to: z.ZodNumber;
    }, z.core.$strip>>;
    xmux: z.ZodOptional<z.ZodObject<{
        maxConcurrency: z.ZodOptional<z.ZodObject<{
            from: z.ZodNumber;
            to: z.ZodNumber;
        }, z.core.$strip>>;
        maxConnections: z.ZodOptional<z.ZodObject<{
            from: z.ZodNumber;
            to: z.ZodNumber;
        }, z.core.$strip>>;
        cMaxReuseTimes: z.ZodOptional<z.ZodObject<{
            from: z.ZodNumber;
            to: z.ZodNumber;
        }, z.core.$strip>>;
        hMaxRequestTimes: z.ZodOptional<z.ZodObject<{
            from: z.ZodNumber;
            to: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const KcpSettingsSchema: z.ZodObject<{
    mtu: z.ZodOptional<z.ZodNumber>;
    tti: z.ZodOptional<z.ZodNumber>;
    uplinkCapacity: z.ZodOptional<z.ZodNumber>;
    downlinkCapacity: z.ZodOptional<z.ZodNumber>;
    congestion: z.ZodOptional<z.ZodBoolean>;
    readBufferSize: z.ZodOptional<z.ZodNumber>;
    writeBufferSize: z.ZodOptional<z.ZodNumber>;
    header: z.ZodOptional<z.ZodObject<{
        type: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    seed: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const HttpUpgradeSettingsSchema: z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    host: z.ZodOptional<z.ZodString>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    acceptProxyProtocol: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const SocketSettingsSchema: z.ZodObject<{
    mark: z.ZodOptional<z.ZodNumber>;
    tcpFastOpen: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodNumber]>>;
    tproxy: z.ZodOptional<z.ZodString>;
    domainStrategy: z.ZodOptional<z.ZodString>;
    dialerProxy: z.ZodOptional<z.ZodString>;
    acceptProxyProtocol: z.ZodOptional<z.ZodBoolean>;
    tcpKeepAliveInterval: z.ZodOptional<z.ZodNumber>;
    tcpKeepAliveIdle: z.ZodOptional<z.ZodNumber>;
    tcpCongestion: z.ZodOptional<z.ZodString>;
    interface: z.ZodOptional<z.ZodString>;
    tcpMptcp: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const TRANSPORT_INFO: {
    readonly tcp: {
        readonly name: "TCP/RAW";
        readonly description: "Raw TCP connection, lowest overhead";
        readonly supportsReality: true;
    };
    readonly ws: {
        readonly name: "WebSocket";
        readonly description: "WebSocket transport, good for CDN and reverse proxy";
        readonly supportsReality: false;
    };
    readonly grpc: {
        readonly name: "gRPC";
        readonly description: "gRPC transport, supports multiplexing";
        readonly supportsReality: true;
    };
    readonly xhttp: {
        readonly name: "XHTTP (SplitHTTP)";
        readonly description: "Next-generation HTTP transport with H2/H3 support";
        readonly supportsReality: true;
    };
    readonly mkcp: {
        readonly name: "mKCP";
        readonly description: "UDP-based transport with congestion control";
        readonly supportsReality: false;
    };
    readonly httpupgrade: {
        readonly name: "HTTPUpgrade";
        readonly description: "HTTP Upgrade transport";
        readonly supportsReality: false;
    };
};
//# sourceMappingURL=transports.d.ts.map