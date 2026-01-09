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
export declare const GenerateServerConfigInputSchema: z.ZodObject<{
    protocol: z.ZodEnum<{
        vless: "vless";
        vmess: "vmess";
        trojan: "trojan";
        shadowsocks: "shadowsocks";
    }>;
    port: z.ZodNumber;
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
    tls_cert_file: z.ZodOptional<z.ZodString>;
    tls_key_file: z.ZodOptional<z.ZodString>;
    tls_server_name: z.ZodOptional<z.ZodString>;
    reality_dest: z.ZodOptional<z.ZodString>;
    reality_server_names: z.ZodOptional<z.ZodArray<z.ZodString>>;
    reality_private_key: z.ZodOptional<z.ZodString>;
    reality_short_ids: z.ZodOptional<z.ZodArray<z.ZodString>>;
    ws_path: z.ZodOptional<z.ZodString>;
    ws_host: z.ZodOptional<z.ZodString>;
    grpc_service_name: z.ZodOptional<z.ZodString>;
    xhttp_path: z.ZodOptional<z.ZodString>;
    xhttp_host: z.ZodOptional<z.ZodString>;
    users: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        level: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
    ss_method: z.ZodOptional<z.ZodEnum<{
        "2022-blake3-aes-128-gcm": "2022-blake3-aes-128-gcm";
        "2022-blake3-aes-256-gcm": "2022-blake3-aes-256-gcm";
        "2022-blake3-chacha20-poly1305": "2022-blake3-chacha20-poly1305";
        "aes-128-gcm": "aes-128-gcm";
        "aes-256-gcm": "aes-256-gcm";
        "chacha20-poly1305": "chacha20-poly1305";
        "xchacha20-poly1305": "xchacha20-poly1305";
    }>>;
    vless_flow: z.ZodOptional<z.ZodEnum<{
        "": "";
        "xtls-rprx-vision": "xtls-rprx-vision";
    }>>;
    fallback_dest: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    enable_routing: z.ZodDefault<z.ZodBoolean>;
    block_ads: z.ZodDefault<z.ZodBoolean>;
    block_cn: z.ZodDefault<z.ZodBoolean>;
    enable_dns: z.ZodDefault<z.ZodBoolean>;
    log_level: z.ZodDefault<z.ZodEnum<{
        error: "error";
        none: "none";
        debug: "debug";
        info: "info";
        warning: "warning";
    }>>;
}, z.core.$strip>;
export type GenerateServerConfigInput = z.infer<typeof GenerateServerConfigInputSchema>;
/**
 * Generate Xray server configuration
 */
export declare function generateServerConfig(input: GenerateServerConfigInput): {
    config: SimpleXrayConfig;
    users: Array<{
        id: string;
        email?: string;
    }>;
    realityKeys?: {
        privateKey: string;
        publicKey: string;
    };
};
//# sourceMappingURL=generate-server.d.ts.map