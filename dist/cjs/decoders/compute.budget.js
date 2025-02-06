"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeComputeBudgetInstruction = decodeComputeBudgetInstruction;
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = require("bn.js");
function decodeComputeBudgetInstruction(instruction) {
    const type = web3_js_1.ComputeBudgetInstruction.decodeInstructionType(instruction);
    let parsed;
    switch (type) {
        case "RequestHeapFrame": {
            const decoded = web3_js_1.ComputeBudgetInstruction.decodeRequestHeapFrame(instruction);
            parsed = {
                name: "requestHeapFrame",
                accounts: [],
                args: {
                    bytes: decoded.bytes,
                },
                programId: instruction.programId,
            };
            break;
        }
        case "RequestUnits": {
            const decoded = web3_js_1.ComputeBudgetInstruction.decodeRequestUnits(instruction);
            parsed = {
                name: "requestUnits",
                accounts: [],
                args: {
                    units: decoded.units,
                    additionalFee: decoded.additionalFee,
                },
                programId: instruction.programId,
            };
            break;
        }
        case "SetComputeUnitLimit": {
            const decoded = web3_js_1.ComputeBudgetInstruction.decodeSetComputeUnitLimit(instruction);
            parsed = {
                name: "setComputeUnitLimit",
                accounts: [],
                args: {
                    units: decoded.units,
                },
                programId: instruction.programId,
            };
            break;
        }
        case "SetComputeUnitPrice": {
            const decoded = web3_js_1.ComputeBudgetInstruction.decodeSetComputeUnitPrice(instruction);
            parsed = {
                name: "setComputeUnitPrice",
                accounts: [],
                args: {
                    microLamports: new bn_js_1.BN(decoded.microLamports.toString()),
                },
                programId: instruction.programId,
            };
            break;
        }
        default: {
            parsed = null;
        }
    }
    return parsed
        ? parsed
        : {
            programId: instruction.programId,
            name: "unknown",
            accounts: instruction.keys,
            args: { unknown: instruction.data },
        };
}
//# sourceMappingURL=compute.budget.js.map