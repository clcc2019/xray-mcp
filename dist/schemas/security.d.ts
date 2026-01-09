import { z } from 'zod';
export declare const SecurityType: z.ZodEnum<{
    none: "none";
    tls: "tls";
    reality: "reality";
}>;
export type SecurityType = z.infer<typeof SecurityType>;
export declare const TlsCertificateSchema: z.ZodObject<{
    certificateFile: z.ZodOptional<z.ZodString>;
    certificate: z.ZodOptional<z.ZodArray<z.ZodString>>;
    keyFile: z.ZodOptional<z.ZodString>;
    key: z.ZodOptional<z.ZodArray<z.ZodString>>;
    usage: z.ZodDefault<z.ZodEnum<{
        encipherment: "encipherment";
        verify: "verify";
        issue: "issue";
    }>>;
    ocspStapling: z.ZodOptional<z.ZodNumber>;
    oneTimeLoading: z.ZodOptional<z.ZodBoolean>;
    buildChain: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const TlsServerSettingsSchema: z.ZodObject<{
    serverName: z.ZodOptional<z.ZodString>;
    alpn: z.ZodDefault<z.ZodArray<z.ZodString>>;
    certificates: z.ZodOptional<z.ZodArray<z.ZodObject<{
        certificateFile: z.ZodOptional<z.ZodString>;
        certificate: z.ZodOptional<z.ZodArray<z.ZodString>>;
        keyFile: z.ZodOptional<z.ZodString>;
        key: z.ZodOptional<z.ZodArray<z.ZodString>>;
        usage: z.ZodDefault<z.ZodEnum<{
            encipherment: "encipherment";
            verify: "verify";
            issue: "issue";
        }>>;
        ocspStapling: z.ZodOptional<z.ZodNumber>;
        oneTimeLoading: z.ZodOptional<z.ZodBoolean>;
        buildChain: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    minVersion: z.ZodOptional<z.ZodString>;
    maxVersion: z.ZodOptional<z.ZodString>;
    cipherSuites: z.ZodOptional<z.ZodString>;
    rejectUnknownSni: z.ZodDefault<z.ZodBoolean>;
    fingerprint: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const TlsClientSettingsSchema: z.ZodObject<{
    serverName: z.ZodOptional<z.ZodString>;
    alpn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    allowInsecure: z.ZodDefault<z.ZodBoolean>;
    disableSystemRoot: z.ZodDefault<z.ZodBoolean>;
    fingerprint: z.ZodOptional<z.ZodEnum<{
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
    pinnedPeerCertificateChainSha256: z.ZodOptional<z.ZodArray<z.ZodString>>;
    pinnedPeerCertificatePublicKeySha256: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const RealityServerSettingsSchema: z.ZodObject<{
    show: z.ZodDefault<z.ZodBoolean>;
    dest: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    xver: z.ZodDefault<z.ZodNumber>;
    serverNames: z.ZodArray<z.ZodString>;
    privateKey: z.ZodString;
    shortIds: z.ZodArray<z.ZodString>;
    minClientVer: z.ZodOptional<z.ZodString>;
    maxClientVer: z.ZodOptional<z.ZodString>;
    maxTimeDiff: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const RealityClientSettingsSchema: z.ZodObject<{
    serverName: z.ZodOptional<z.ZodString>;
    fingerprint: z.ZodDefault<z.ZodEnum<{
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
    publicKey: z.ZodString;
    shortId: z.ZodDefault<z.ZodString>;
    spiderX: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const FINGERPRINTS: readonly ["chrome", "firefox", "safari", "ios", "android", "edge", "qq", "360", "random", "randomized"];
export declare const SECURITY_INFO: {
    readonly none: {
        readonly name: "None";
        readonly description: "No encryption, use only for local or already encrypted connections";
        readonly requiresCert: false;
    };
    readonly tls: {
        readonly name: "TLS";
        readonly description: "Standard TLS encryption, requires valid certificate";
        readonly requiresCert: true;
    };
    readonly reality: {
        readonly name: "REALITY";
        readonly description: "Advanced TLS camouflage technology, no certificate needed";
        readonly requiresCert: false;
    };
};
export declare const REALITY_TARGETS: readonly [{
    readonly domain: "www.microsoft.com";
    readonly description: "Microsoft (recommended)";
}, {
    readonly domain: "www.apple.com";
    readonly description: "Apple";
}, {
    readonly domain: "www.amazon.com";
    readonly description: "Amazon";
}, {
    readonly domain: "www.cloudflare.com";
    readonly description: "Cloudflare";
}, {
    readonly domain: "www.google.com";
    readonly description: "Google";
}, {
    readonly domain: "www.yahoo.com";
    readonly description: "Yahoo";
}, {
    readonly domain: "www.bing.com";
    readonly description: "Bing";
}, {
    readonly domain: "www.github.com";
    readonly description: "GitHub";
}];
//# sourceMappingURL=security.d.ts.map