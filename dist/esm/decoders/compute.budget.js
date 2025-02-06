import { ComputeBudgetInstruction } from "@solana/web3.js";
import { BN } from "bn.js";
export function decodeComputeBudgetInstruction(instruction) {
    const type = ComputeBudgetInstruction.decodeInstructionType(instruction);
    let parsed;
    switch (type) {
        case "RequestHeapFrame": {
            const decoded = ComputeBudgetInstruction.decodeRequestHeapFrame(instruction);
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
            const decoded = ComputeBudgetInstruction.decodeRequestUnits(instruction);
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
            const decoded = ComputeBudgetInstruction.decodeSetComputeUnitLimit(instruction);
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
            const decoded = ComputeBudgetInstruction.decodeSetComputeUnitPrice(instruction);
            parsed = {
                name: "setComputeUnitPrice",
                accounts: [],
                args: {
                    microLamports: new BN(decoded.microLamports.toString()),
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