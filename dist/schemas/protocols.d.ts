import { z } from 'zod';
export declare const ProtocolType: z.ZodEnum<{
    vless: "vless";
    vmess: "vmess";
    trojan: "trojan";
    shadowsocks: "shadowsocks";
    http: "http";
    socks: "socks";
}>;
export type ProtocolType = z.infer<typeof ProtocolType>;
export declare const VLessUserSchema: z.ZodObject<{
    id: z.ZodString;
    flow: z.ZodDefault<z.ZodEnum<{
        "": "";
        "xtls-rprx-vision": "xtls-rprx-vision";
    }>>;
    level: z.ZodDefault<z.ZodNumber>;
    email: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const VLessInboundSettingsSchema: z.ZodObject<{
    clients: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        flow: z.ZodDefault<z.ZodEnum<{
            "": "";
            "xtls-rprx-vision": "xtls-rprx-vision";
        }>>;
        level: z.ZodDefault<z.ZodNumber>;
        email: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    decryption: z.ZodDefault<z.ZodString>;
    fallbacks: z.ZodOptional<z.ZodArray<z.ZodObject<{
        dest: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
        path: z.ZodOptional<z.ZodString>;
        xver: z.ZodOptional<z.ZodNumber>;
        alpn: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const VLessOutboundSettingsSchema: z.ZodObject<{
    address: z.ZodString;
    port: z.ZodNumber;
    id: z.ZodString;
    flow: z.ZodDefault<z.ZodEnum<{
        "": "";
        "xtls-rprx-vision": "xtls-rprx-vision";
    }>>;
    encryption: z.ZodDefault<z.ZodString>;
    level: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const VMessUserSchema: z.ZodObject<{
    id: z.ZodString;
    security: z.ZodDefault<z.ZodEnum<{
        none: "none";
        "aes-128-gcm": "aes-128-gcm";
        "chacha20-poly1305": "chacha20-poly1305";
        auto: "auto";
        zero: "zero";
    }>>;
    level: z.ZodDefault<z.ZodNumber>;
    email: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const VMessInboundSettingsSchema: z.ZodObject<{
    clients: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        security: z.ZodDefault<z.ZodEnum<{
            none: "none";
            "aes-128-gcm": "aes-128-gcm";
            "chacha20-poly1305": "chacha20-poly1305";
            auto: "auto";
            zero: "zero";
        }>>;
        level: z.ZodDefault<z.ZodNumber>;
        email: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const VMessOutboundSettingsSchema: z.ZodObject<{
    address: z.ZodString;
    port: z.ZodNumber;
    id: z.ZodString;
    security: z.ZodDefault<z.ZodEnum<{
        none: "none";
        "aes-128-gcm": "aes-128-gcm";
        "chacha20-poly1305": "chacha20-poly1305";
        auto: "auto";
        zero: "zero";
    }>>;
    level: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const TrojanUserSchema: z.ZodObject<{
    password: z.ZodString;
    level: z.ZodDefault<z.ZodNumber>;
    email: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const TrojanInboundSettingsSchema: z.ZodObject<{
    clients: z.ZodArray<z.ZodObject<{
        password: z.ZodString;
        level: z.ZodDefault<z.ZodNumber>;
        email: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    fallbacks: z.ZodOptional<z.ZodArray<z.ZodObject<{
        dest: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
        path: z.ZodOptional<z.ZodString>;
        xver: z.ZodOptional<z.ZodNumber>;
        alpn: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const TrojanOutboundSettingsSchema: z.ZodObject<{
    address: z.ZodString;
    port: z.ZodNumber;
    password: z.ZodString;
    level: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const ShadowsocksCipher: z.ZodEnum<{
    "2022-blake3-aes-128-gcm": "2022-blake3-aes-128-gcm";
    "2022-blake3-aes-256-gcm": "2022-blake3-aes-256-gcm";
    "2022-blake3-chacha20-poly1305": "2022-blake3-chacha20-poly1305";
    none: "none";
    "aes-128-gcm": "aes-128-gcm";
    "aes-256-gcm": "aes-256-gcm";
    "chacha20-poly1305": "chacha20-poly1305";
    "xchacha20-poly1305": "xchacha20-poly1305";
}>;
export declare const ShadowsocksUserSchema: z.ZodObject<{
    password: z.ZodString;
    method: z.ZodEnum<{
        "2022-blake3-aes-128-gcm": "2022-blake3-aes-128-gcm";
        "2022-blake3-aes-256-gcm": "2022-blake3-aes-256-gcm";
        "2022-blake3-chacha20-poly1305": "2022-blake3-chacha20-poly1305";
        none: "none";
        "aes-128-gcm": "aes-128-gcm";
        "aes-256-gcm": "aes-256-gcm";
        "chacha20-poly1305": "chacha20-poly1305";
        "xchacha20-poly1305": "xchacha20-poly1305";
    }>;
    level: z.ZodDefault<z.ZodNumber>;
    email: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const ShadowsocksInboundSettingsSchema: z.ZodObject<{
    password: z.ZodOptional<z.ZodString>;
    method: z.ZodOptional<z.ZodEnum<{
        "2022-blake3-aes-128-gcm": "2022-blake3-aes-128-gcm";
        "2022-blake3-aes-256-gcm": "2022-blake3-aes-256-gcm";
        "2022-blake3-chacha20-poly1305": "2022-blake3-chacha20-poly1305";
        none: "none";
        "aes-128-gcm": "aes-128-gcm";
        "aes-256-gcm": "aes-256-gcm";
        "chacha20-poly1305": "chacha20-poly1305";
        "xchacha20-poly1305": "xchacha20-poly1305";
    }>>;
    clients: z.ZodOptional<z.ZodArray<z.ZodObject<{
        password: z.ZodString;
        method: z.ZodEnum<{
            "2022-blake3-aes-128-gcm": "2022-blake3-aes-128-gcm";
            "2022-blake3-aes-256-gcm": "2022-blake3-aes-256-gcm";
            "2022-blake3-chacha20-poly1305": "2022-blake3-chacha20-poly1305";
            none: "none";
            "aes-128-gcm": "aes-128-gcm";
            "aes-256-gcm": "aes-256-gcm";
            "chacha20-poly1305": "chacha20-poly1305";
            "xchacha20-poly1305": "xchacha20-poly1305";
        }>;
        level: z.ZodDefault<z.ZodNumber>;
        email: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    network: z.ZodDefault<z.ZodEnum<{
        tcp: "tcp";
        "tcp,udp": "tcp,udp";
        udp: "udp";
    }>>;
}, z.core.$strip>;
export declare const ShadowsocksOutboundSettingsSchema: z.ZodObject<{
    address: z.ZodString;
    port: z.ZodNumber;
    password: z.ZodString;
    method: z.ZodEnum<{
        "2022-blake3-aes-128-gcm": "2022-blake3-aes-128-gcm";
        "2022-blake3-aes-256-gcm": "2022-blake3-aes-256-gcm";
        "2022-blake3-chacha20-poly1305": "2022-blake3-chacha20-poly1305";
        none: "none";
        "aes-128-gcm": "aes-128-gcm";
        "aes-256-gcm": "aes-256-gcm";
        "chacha20-poly1305": "chacha20-poly1305";
        "xchacha20-poly1305": "xchacha20-poly1305";
    }>;
    level: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const SocksInboundSettingsSchema: z.ZodObject<{
    auth: z.ZodDefault<z.ZodEnum<{
        password: "password";
        noauth: "noauth";
    }>>;
    accounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        user: z.ZodString;
        pass: z.ZodString;
    }, z.core.$strip>>>;
    udp: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const SocksOutboundSettingsSchema: z.ZodObject<{
    address: z.ZodString;
    port: z.ZodNumber;
    users: z.ZodOptional<z.ZodArray<z.ZodObject<{
        user: z.ZodString;
        pass: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const HttpInboundSettingsSchema: z.ZodObject<{
    accounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        user: z.ZodString;
        pass: z.ZodString;
    }, z.core.$strip>>>;
    allowTransparent: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const HttpOutboundSettingsSchema: z.ZodObject<{
    address: z.ZodString;
    port: z.ZodNumber;
    users: z.ZodOptional<z.ZodArray<z.ZodObject<{
        user: z.ZodString;
        pass: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const FreedomOutboundSettingsSchema: z.ZodObject<{
    domainStrategy: z.ZodDefault<z.ZodEnum<{
        AsIs: "AsIs";
        UseIP: "UseIP";
        UseIPv4: "UseIPv4";
        UseIPv6: "UseIPv6";
    }>>;
    redirect: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const BlackholeOutboundSettingsSchema: z.ZodObject<{
    response: z.ZodOptional<z.ZodObject<{
        type: z.ZodDefault<z.ZodEnum<{
            none: "none";
            http: "http";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const PROTOCOL_INFO: {
    readonly vless: {
        readonly name: "VLESS";
        readonly description: "Lightweight protocol with optional XTLS Vision support for better performance";
        readonly authType: "uuid";
        readonly supportsFlow: true;
    };
    readonly vmess: {
        readonly name: "VMess";
        readonly description: "Classic V2Ray protocol with multiple encryption methods";
        readonly authType: "uuid";
        readonly supportsFlow: false;
    };
    readonly trojan: {
        readonly name: "Trojan";
        readonly description: "Protocol that disguises traffic as HTTPS";
        readonly authType: "password";
        readonly supportsFlow: false;
    };
    readonly shadowsocks: {
        readonly name: "Shadowsocks";
        readonly description: "Lightweight protocol supporting AEAD and 2022 ciphers";
        readonly authType: "password";
        readonly supportsFlow: false;
    };
    readonly socks: {
        readonly name: "SOCKS";
        readonly description: "Standard SOCKS5 proxy protocol";
        readonly authType: "optional";
        readonly supportsFlow: false;
    };
    readonly http: {
        readonly name: "HTTP";
        readonly description: "Standard HTTP proxy protocol";
        readonly authType: "optional";
        readonly supportsFlow: false;
    };
};
//# sourceMappingURL=protocols.d.ts.map