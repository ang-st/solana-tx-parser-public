"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeAssociatedTokenInstruction = decodeAssociatedTokenInstruction;
const spl_token_1 = require("@solana/spl-token");
function decodeAssociatedTokenInstruction(instruction) {
    return {
        name: instruction.data[0] == 0 ? "createAssociatedTokenAccountIdempotent" : "createAssociatedTokenAccount",
        accounts: [
            { name: "fundingAccount", ...instruction.keys[0] },
            { name: "newAccount", ...instruction.keys[1] },
            { name: "wallet", ...instruction.keys[2] },
            { name: "tokenMint", ...instruction.keys[3] },
            { name: "systemProgram", ...instruction.keys[4] },
            { name: "tokenProgram", ...instruction.keys[5] },
            ...[instruction.keys.length > 6 ? { name: "rent", ...instruction.keys[6] } : undefined],
        ],
        args: {},
        programId: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
    };
}
//# sourceMappingURL=associated.js.map