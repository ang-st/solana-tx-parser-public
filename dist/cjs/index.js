"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idl = exports.convertLegacyIdlToV30 = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./parsers"), exports);
tslib_1.__exportStar(require("./helpers"), exports);
tslib_1.__exportStar(require("./interfaces"), exports);
var legacy_idl_converter_1 = require("./legacy.idl.converter");
Object.defineProperty(exports, "convertLegacyIdlToV30", { enumerable: true, get: function () { return legacy_idl_converter_1.convertLegacyIdlToV30; } });
exports.idl = tslib_1.__importStar(require("./programs"));
//# sourceMappingURL=index.js.map