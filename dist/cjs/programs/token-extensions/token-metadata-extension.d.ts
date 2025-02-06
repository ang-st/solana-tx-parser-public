export declare const metadataLayout: import("@solana/codecs").VariableSizeCodec<{
    instruction: Uint8Array<ArrayBufferLike> | import("@solana/codecs").ReadonlyUint8Array;
    name: string;
    symbol: string;
    uri: string;
    additionalMetadata: (readonly [string, string])[];
}, {
    instruction: import("@solana/codecs").ReadonlyUint8Array;
    name: string;
    symbol: string;
    uri: string;
    additionalMetadata: (readonly [string, string])[];
} & {
    instruction: Uint8Array<ArrayBufferLike> | import("@solana/codecs").ReadonlyUint8Array;
    name: string;
    symbol: string;
    uri: string;
    additionalMetadata: (readonly [string, string])[];
}>;
export declare const updateMetadataLayout: import("@solana/codecs").VariableSizeCodec<{
    instruction: Uint8Array<ArrayBufferLike> | import("@solana/codecs").ReadonlyUint8Array;
    field: (object & {
        __kind: "Name";
    }) | (object & {
        __kind: "Symbol";
    }) | (object & {
        __kind: "Uri";
    }) | ({
        value: readonly [string];
    } & {
        __kind: "Key";
    });
    value: string;
}, {
    instruction: import("@solana/codecs").ReadonlyUint8Array;
    field: (object & {
        __kind: "Name";
    } & {
        __kind: "Name";
    }) | (object & {
        __kind: "Symbol";
    } & {
        __kind: "Symbol";
    }) | (object & {
        __kind: "Uri";
    } & {
        __kind: "Uri";
    }) | ({
        value: readonly [string];
    } & {
        value: readonly [string];
    } & {
        __kind: "Key";
    } & {
        __kind: "Key";
    });
    value: string;
} & {
    instruction: Uint8Array<ArrayBufferLike> | import("@solana/codecs").ReadonlyUint8Array;
    field: (object & {
        __kind: "Name";
    }) | (object & {
        __kind: "Symbol";
    }) | (object & {
        __kind: "Uri";
    }) | ({
        value: readonly [string];
    } & {
        __kind: "Key";
    });
    value: string;
}>;
export declare const removeKeyLayout: import("@solana/codecs").VariableSizeCodec<{
    idempotent: boolean;
    key: string;
}, {
    idempotent: boolean;
    key: string;
} & {
    idempotent: boolean;
    key: string;
}>;
export declare const updateAuthorityLayout: import("@solana/codecs").FixedSizeCodec<{
    newAuthority: Uint8Array<ArrayBufferLike> | import("@solana/codecs").ReadonlyUint8Array;
}, {
    newAuthority: import("@solana/codecs").ReadonlyUint8Array;
} & {
    newAuthority: Uint8Array<ArrayBufferLike> | import("@solana/codecs").ReadonlyUint8Array;
}>;
export declare const emitLayout: import("@solana/codecs").VariableSizeCodec<{
    start: import("@solana/codecs").OptionOrNullable<number | bigint>;
    end: import("@solana/codecs").OptionOrNullable<number | bigint>;
}, {
    start: import("@solana/codecs").Option<bigint>;
    end: import("@solana/codecs").Option<bigint>;
} & {
    start: import("@solana/codecs").OptionOrNullable<number | bigint>;
    end: import("@solana/codecs").OptionOrNullable<number | bigint>;
}>;
//# sourceMappingURL=token-metadata-extension.d.ts.map