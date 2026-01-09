import { z } from 'zod';
export declare const LogConfigSchema: z.ZodObject<{
    access: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    loglevel: z.ZodOptional<z.ZodEnum<{
        error: "error";
        none: "none";
        debug: "debug";
        info: "info";
        warning: "warning";
    }>>;
    dnsLog: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const SniffingConfigSchema: z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    destOverride: z.ZodOptional<z.ZodArray<z.ZodString>>;
    metadataOnly: z.ZodOptional<z.ZodBoolean>;
    routeOnly: z.ZodOptional<z.ZodBoolean>;
    domainsExcluded: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const InboundConfigSchema: z.ZodObject<{
    tag: z.ZodOptional<z.ZodString>;
    port: z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>;
    listen: z.ZodOptional<z.ZodString>;
    protocol: z.ZodString;
    settings: z.ZodAny;
    streamSettings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    sniffing: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        destOverride: z.ZodOptional<z.ZodArray<z.ZodString>>;
        metadataOnly: z.ZodOptional<z.ZodBoolean>;
        routeOnly: z.ZodOptional<z.ZodBoolean>;
        domainsExcluded: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const OutboundConfigSchema: z.ZodObject<{
    tag: z.ZodOptional<z.ZodString>;
    protocol: z.ZodString;
    settings: z.ZodAny;
    streamSettings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    mux: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        concurrency: z.ZodOptional<z.ZodNumber>;
        xudpConcurrency: z.ZodOptional<z.ZodNumber>;
        xudpProxyUDP443: z.ZodOptional<z.ZodEnum<{
            reject: "reject";
            allow: "allow";
            skip: "skip";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const RoutingRuleSchema: z.ZodObject<{
    ruleTag: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodString>;
    domain: z.ZodOptional<z.ZodArray<z.ZodString>>;
    ip: z.ZodOptional<z.ZodArray<z.ZodString>>;
    port: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    sourcePort: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    network: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodArray<z.ZodString>>;
    user: z.ZodOptional<z.ZodArray<z.ZodString>>;
    inboundTag: z.ZodOptional<z.ZodArray<z.ZodString>>;
    protocol: z.ZodOptional<z.ZodArray<z.ZodString>>;
    attrs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    outboundTag: z.ZodOptional<z.ZodString>;
    balancerTag: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const RoutingConfigSchema: z.ZodObject<{
    domainStrategy: z.ZodOptional<z.ZodString>;
    domainMatcher: z.ZodOptional<z.ZodString>;
    rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
        ruleTag: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        domain: z.ZodOptional<z.ZodArray<z.ZodString>>;
        ip: z.ZodOptional<z.ZodArray<z.ZodString>>;
        port: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        sourcePort: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        network: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodArray<z.ZodString>>;
        user: z.ZodOptional<z.ZodArray<z.ZodString>>;
        inboundTag: z.ZodOptional<z.ZodArray<z.ZodString>>;
        protocol: z.ZodOptional<z.ZodArray<z.ZodString>>;
        attrs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        outboundTag: z.ZodOptional<z.ZodString>;
        balancerTag: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    balancers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        tag: z.ZodString;
        selector: z.ZodArray<z.ZodString>;
        strategy: z.ZodOptional<z.ZodObject<{
            type: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const DnsServerSchema: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    address: z.ZodString;
    port: z.ZodOptional<z.ZodNumber>;
    domains: z.ZodOptional<z.ZodArray<z.ZodString>>;
    expectedIPs: z.ZodOptional<z.ZodArray<z.ZodString>>;
    expectIPs: z.ZodOptional<z.ZodArray<z.ZodString>>;
    skipFallback: z.ZodOptional<z.ZodBoolean>;
    clientIp: z.ZodOptional<z.ZodString>;
    queryStrategy: z.ZodOptional<z.ZodString>;
}, z.core.$strip>]>;
export declare const DnsConfigSchema: z.ZodObject<{
    hosts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>>;
    servers: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        address: z.ZodString;
        port: z.ZodOptional<z.ZodNumber>;
        domains: z.ZodOptional<z.ZodArray<z.ZodString>>;
        expectedIPs: z.ZodOptional<z.ZodArray<z.ZodString>>;
        expectIPs: z.ZodOptional<z.ZodArray<z.ZodString>>;
        skipFallback: z.ZodOptional<z.ZodBoolean>;
        clientIp: z.ZodOptional<z.ZodString>;
        queryStrategy: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>]>>>;
    clientIp: z.ZodOptional<z.ZodString>;
    queryStrategy: z.ZodOptional<z.ZodString>;
    disableCache: z.ZodOptional<z.ZodBoolean>;
    disableFallback: z.ZodOptional<z.ZodBoolean>;
    disableFallbackIfMatch: z.ZodOptional<z.ZodBoolean>;
    tag: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const PolicyLevelSchema: z.ZodObject<{
    handshake: z.ZodOptional<z.ZodNumber>;
    connIdle: z.ZodOptional<z.ZodNumber>;
    uplinkOnly: z.ZodOptional<z.ZodNumber>;
    downlinkOnly: z.ZodOptional<z.ZodNumber>;
    statsUserUplink: z.ZodOptional<z.ZodBoolean>;
    statsUserDownlink: z.ZodOptional<z.ZodBoolean>;
    bufferSize: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const PolicyConfigSchema: z.ZodObject<{
    levels: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        handshake: z.ZodOptional<z.ZodNumber>;
        connIdle: z.ZodOptional<z.ZodNumber>;
        uplinkOnly: z.ZodOptional<z.ZodNumber>;
        downlinkOnly: z.ZodOptional<z.ZodNumber>;
        statsUserUplink: z.ZodOptional<z.ZodBoolean>;
        statsUserDownlink: z.ZodOptional<z.ZodBoolean>;
        bufferSize: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
    system: z.ZodOptional<z.ZodObject<{
        statsInboundUplink: z.ZodOptional<z.ZodBoolean>;
        statsInboundDownlink: z.ZodOptional<z.ZodBoolean>;
        statsOutboundUplink: z.ZodOptional<z.ZodBoolean>;
        statsOutboundDownlink: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const StatsConfigSchema: z.ZodObject<{}, z.core.$strip>;
export declare const ApiConfigSchema: z.ZodObject<{
    tag: z.ZodOptional<z.ZodString>;
    services: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const XrayConfigSchema: z.ZodObject<{
    log: z.ZodOptional<z.ZodObject<{
        access: z.ZodOptional<z.ZodString>;
        error: z.ZodOptional<z.ZodString>;
        loglevel: z.ZodOptional<z.ZodEnum<{
            error: "error";
            none: "none";
            debug: "debug";
            info: "info";
            warning: "warning";
        }>>;
        dnsLog: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    api: z.ZodOptional<z.ZodObject<{
        tag: z.ZodOptional<z.ZodString>;
        services: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    dns: z.ZodOptional<z.ZodObject<{
        hosts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>>;
        servers: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
            address: z.ZodString;
            port: z.ZodOptional<z.ZodNumber>;
            domains: z.ZodOptional<z.ZodArray<z.ZodString>>;
            expectedIPs: z.ZodOptional<z.ZodArray<z.ZodString>>;
            expectIPs: z.ZodOptional<z.ZodArray<z.ZodString>>;
            skipFallback: z.ZodOptional<z.ZodBoolean>;
            clientIp: z.ZodOptional<z.ZodString>;
            queryStrategy: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>]>>>;
        clientIp: z.ZodOptional<z.ZodString>;
        queryStrategy: z.ZodOptional<z.ZodString>;
        disableCache: z.ZodOptional<z.ZodBoolean>;
        disableFallback: z.ZodOptional<z.ZodBoolean>;
        disableFallbackIfMatch: z.ZodOptional<z.ZodBoolean>;
        tag: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    routing: z.ZodOptional<z.ZodObject<{
        domainStrategy: z.ZodOptional<z.ZodString>;
        domainMatcher: z.ZodOptional<z.ZodString>;
        rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
            ruleTag: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodString>;
            domain: z.ZodOptional<z.ZodArray<z.ZodString>>;
            ip: z.ZodOptional<z.ZodArray<z.ZodString>>;
            port: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            sourcePort: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            network: z.ZodOptional<z.ZodString>;
            source: z.ZodOptional<z.ZodArray<z.ZodString>>;
            user: z.ZodOptional<z.ZodArray<z.ZodString>>;
            inboundTag: z.ZodOptional<z.ZodArray<z.ZodString>>;
            protocol: z.ZodOptional<z.ZodArray<z.ZodString>>;
            attrs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            outboundTag: z.ZodOptional<z.ZodString>;
            balancerTag: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        balancers: z.ZodOptional<z.ZodArray<z.ZodObject<{
            tag: z.ZodString;
            selector: z.ZodArray<z.ZodString>;
            strategy: z.ZodOptional<z.ZodObject<{
                type: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    policy: z.ZodOptional<z.ZodObject<{
        levels: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            handshake: z.ZodOptional<z.ZodNumber>;
            connIdle: z.ZodOptional<z.ZodNumber>;
            uplinkOnly: z.ZodOptional<z.ZodNumber>;
            downlinkOnly: z.ZodOptional<z.ZodNumber>;
            statsUserUplink: z.ZodOptional<z.ZodBoolean>;
            statsUserDownlink: z.ZodOptional<z.ZodBoolean>;
            bufferSize: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>;
        system: z.ZodOptional<z.ZodObject<{
            statsInboundUplink: z.ZodOptional<z.ZodBoolean>;
            statsInboundDownlink: z.ZodOptional<z.ZodBoolean>;
            statsOutboundUplink: z.ZodOptional<z.ZodBoolean>;
            statsOutboundDownlink: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    inbounds: z.ZodOptional<z.ZodArray<z.ZodObject<{
        tag: z.ZodOptional<z.ZodString>;
        port: z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>;
        listen: z.ZodOptional<z.ZodString>;
        protocol: z.ZodString;
        settings: z.ZodAny;
        streamSettings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        sniffing: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            destOverride: z.ZodOptional<z.ZodArray<z.ZodString>>;
            metadataOnly: z.ZodOptional<z.ZodBoolean>;
            routeOnly: z.ZodOptional<z.ZodBoolean>;
            domainsExcluded: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
    outbounds: z.ZodOptional<z.ZodArray<z.ZodObject<{
        tag: z.ZodOptional<z.ZodString>;
        protocol: z.ZodString;
        settings: z.ZodAny;
        streamSettings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        mux: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            concurrency: z.ZodOptional<z.ZodNumber>;
            xudpConcurrency: z.ZodOptional<z.ZodNumber>;
            xudpProxyUDP443: z.ZodOptional<z.ZodEnum<{
                reject: "reject";
                allow: "allow";
                skip: "skip";
            }>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
    stats: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
}, z.core.$strip>;
export type XrayConfig = z.infer<typeof XrayConfigSchema>;
export type InboundConfig = z.infer<typeof InboundConfigSchema>;
export type OutboundConfig = z.infer<typeof OutboundConfigSchema>;
export type RoutingConfig = z.infer<typeof RoutingConfigSchema>;
export type DnsConfig = z.infer<typeof DnsConfigSchema>;
//# sourceMappingURL=config.d.ts.map