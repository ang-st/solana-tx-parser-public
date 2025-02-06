"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeComputeBudgetInstruction = exports.decodeAssociatedTokenInstruction = exports.decodeToken2022Instruction = exports.decodeTokenInstruction = exports.decodeSystemInstruction = void 0;
const system_1 = require("./system");
Object.defineProperty(exports, "decodeSystemInstruction", { enumerable: true, get: function () { return system_1.decodeSystemInstruction; } });
const token_1 = require("./token");
Object.defineProperty(exports, "decodeTokenInstruction", { enumerable: true, get: function () { return token_1.decodeTokenInstruction; } });
const token22_1 = require("./token22");
Object.defineProperty(exports, "decodeToken2022Instruction", { enumerable: true, get: function () { return token22_1.decodeToken2022Instruction; } });
const associated_1 = require("./associated");
Object.defineProperty(exports, "decodeAssociatedTokenInstruction", { enumerable: true, get: function () { return associated_1.decodeAssociatedTokenInstruction; } });
const compute_budget_1 = require("./compute.budget");
Object.defineProperty(exports, "decodeComputeBudgetInstruction", { enumerable: true, get: function () { return compute_budget_1.decodeComputeBudgetInstruction; } });
//# sourceMappingURL=index.js.map