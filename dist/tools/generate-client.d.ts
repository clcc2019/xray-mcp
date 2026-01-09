import { z } from 'zod';
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
export declare const GenerateClientConfigInputSchema: z.ZodObject<{
    server_address: z.ZodString;
    server_port: z.ZodNumber;
    protocol: z.ZodEnum<{
        vless: "vless";
        vmess: "vmess";
        trojan: "trojan";
        shadowsocks: "shadowsocks";
    }>;
    uuid: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    transport: z.ZodDefault<z.ZodEnum<{
        tcp: "tcp";
        ws: "ws";
        grpc: "grpc";
        xhttp: "xhttp";
    }>>;
    security: z.ZodDefault<z.ZodEnum<{
        none: "none";
        tls: "tls";
        reality: "reality";
    }>>;
    tls_server_name: z.ZodOptional<z.ZodString>;
    tls_allow_insecure: z.ZodDefault<z.ZodBoolean>;
    tls_fingerprint: z.ZodOptional<z.ZodEnum<{
        chrome: "chrome";
        firefox: "firefox";
        safari: "safari";
        ios: "ios";
        android: "android";
        edge: "edge";
        qq: "qq";
        360: "360";
        random: "random";
        randomized: "randomized";
    }>>;
    tls_alpn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    reality_public_key: z.ZodOptional<z.ZodString>;
    reality_short_id: z.ZodOptional<z.ZodString>;
    reality_server_name: z.ZodOptional<z.ZodString>;
    reality_fingerprint: z.ZodDefault<z.ZodEnum<{
        chrome: "chrome";
        firefox: "firefox";
        safari: "safari";
        ios: "ios";
        android: "android";
        edge: "edge";
        qq: "qq";
        360: "360";
        random: "random";
        randomized: "randomized";
    }>>;
    reality_spider_x: z.ZodOptional<z.ZodString>;
    ws_path: z.ZodOptional<z.ZodString>;
    ws_host: z.ZodOptional<z.ZodString>;
    grpc_service_name: z.ZodOptional<z.ZodString>;
    xhttp_path: z.ZodOptional<z.ZodString>;
    xhttp_host: z.ZodOptional<z.ZodString>;
    vless_flow: z.ZodOptional<z.ZodEnum<{
        "": "";
        "xtls-rprx-vision": "xtls-rprx-vision";
    }>>;
    vless_encryption: z.ZodDefault<z.ZodString>;
    vmess_security: z.ZodDefault<z.ZodEnum<{
        none: "none";
        "aes-128-gcm": "aes-128-gcm";
        "chacha20-poly1305": "chacha20-poly1305";
        auto: "auto";
        zero: "zero";
    }>>;
    ss_method: z.ZodOptional<z.ZodEnum<{
        "2022-blake3-aes-128-gcm": "2022-blake3-aes-128-gcm";
        "2022-blake3-aes-256-gcm": "2022-blake3-aes-256-gcm";
        "2022-blake3-chacha20-poly1305": "2022-blake3-chacha20-poly1305";
        "aes-128-gcm": "aes-128-gcm";
        "aes-256-gcm": "aes-256-gcm";
        "chacha20-poly1305": "chacha20-poly1305";
        "xchacha20-poly1305": "xchacha20-poly1305";
    }>>;
    socks_port: z.ZodDefault<z.ZodNumber>;
    http_port: z.ZodOptional<z.ZodNumber>;
    listen_address: z.ZodDefault<z.ZodString>;
    routing_mode: z.ZodDefault<z.ZodEnum<{
        custom: "custom";
        global: "global";
        bypass_cn: "bypass_cn";
        bypass_lan: "bypass_lan";
        bypass_lan_cn: "bypass_lan_cn";
    }>>;
    enable_dns: z.ZodDefault<z.ZodBoolean>;
    dns_servers: z.ZodOptional<z.ZodArray<z.ZodString>>;
    enable_mux: z.ZodDefault<z.ZodBoolean>;
    mux_concurrency: z.ZodDefault<z.ZodNumber>;
    log_level: z.ZodDefault<z.ZodEnum<{
        error: "error";
        none: "none";
        debug: "debug";
        info: "info";
        warning: "warning";
    }>>;
}, z.core.$strip>;
export type GenerateClientConfigInput = z.infer<typeof GenerateClientConfigInputSchema>;
/**
 * Generate Xray client configuration
 */
export declare function generateClientConfig(input: GenerateClientConfigInput): SimpleXrayConfig;
//# sourceMappingURL=generate-client.d.ts.map