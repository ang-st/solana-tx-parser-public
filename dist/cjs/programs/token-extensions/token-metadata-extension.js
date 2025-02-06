"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitLayout = exports.updateAuthorityLayout = exports.removeKeyLayout = exports.updateMetadataLayout = exports.metadataLayout = void 0;
const codecs_data_structures_1 = require("@solana/codecs-data-structures");
const codecs_1 = require("@solana/codecs");
const codecs_2 = require("@solana/codecs");
const codecs_strings_1 = require("@solana/codecs-strings");
exports.metadataLayout = (0, codecs_data_structures_1.getStructCodec)([
    ["instruction", (0, codecs_2.fixCodecSize)((0, codecs_data_structures_1.getBytesCodec)(), 8)],
    ["name", (0, codecs_strings_1.getUtf8Codec)()],
    ["symbol", (0, codecs_strings_1.getUtf8Codec)()],
    ["uri", (0, codecs_strings_1.getUtf8Codec)()],
    ["additionalMetadata", (0, codecs_data_structures_1.getArrayCodec)((0, codecs_data_structures_1.getTupleCodec)([(0, codecs_strings_1.getUtf8Codec)(), (0, codecs_strings_1.getUtf8Codec)()]))],
]);
const getFieldCodec = () => [
    ["Name", (0, codecs_data_structures_1.getUnitCodec)()],
    ["Symbol", (0, codecs_data_structures_1.getUnitCodec)()],
    ["Uri", (0, codecs_data_structures_1.getUnitCodec)()],
    ["Key", (0, codecs_data_structures_1.getStructCodec)([["value", (0, codecs_data_structures_1.getTupleCodec)([(0, codecs_strings_1.getUtf8Codec)()])]])],
];
exports.updateMetadataLayout = (0, codecs_data_structures_1.getStructCodec)([
    ["instruction", (0, codecs_2.fixCodecSize)((0, codecs_data_structures_1.getBytesCodec)(), 8)],
    ["field", (0, codecs_data_structures_1.getDataEnumCodec)(getFieldCodec())],
    ["value", (0, codecs_strings_1.getUtf8Codec)()],
]);
exports.removeKeyLayout = (0, codecs_data_structures_1.getStructCodec)([
    ["idempotent", (0, codecs_data_structures_1.getBooleanCodec)()],
    ["key", (0, codecs_strings_1.getUtf8Codec)()],
]);
exports.updateAuthorityLayout = (0, codecs_data_structures_1.getStructCodec)([["newAuthority", (0, codecs_2.fixCodecSize)((0, codecs_data_structures_1.getBytesCodec)(), 32)]]);
exports.emitLayout = (0, codecs_data_structures_1.getStructCodec)([
    ["start", (0, codecs_1.getOptionCodec)((0, codecs_1.getU64Codec)())],
    ["end", (0, codecs_1.getOptionCodec)((0, codecs_1.getU64Codec)())],
]);
//# sourceMappingURL=token-metadata-extension.js.map