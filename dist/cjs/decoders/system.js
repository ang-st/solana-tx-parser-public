"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSystemInstruction = decodeSystemInstruction;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
function decodeSystemInstruction(instruction) {
    const ixType = web3_js_1.SystemInstruction.decodeInstructionType(instruction);
    let parsed;
    switch (ixType) {
        case "AdvanceNonceAccount": {
            const decoded = web3_js_1.SystemInstruction.decodeNonceAdvance(instruction);
            parsed = {
                name: "advanceNonceAccount",
                args: { authorized: decoded.authorizedPubkey },
                accounts: [
                    { name: "nonce", isSigner: false, isWritable: true, pubkey: instruction.keys[0].pubkey },
                    { name: "recentBlockhashes", isSigner: false, isWritable: false, pubkey: instruction.keys[1].pubkey },
                    { name: "authorized", isSigner: true, isWritable: false, pubkey: instruction.keys[2].pubkey },
                ],
            };
            break;
        }
        case "Allocate": {
            const decoded = web3_js_1.SystemInstruction.decodeAllocate(instruction);
            parsed = {
                name: "allocate",
                accounts: [{ name: "pubkey", pubkey: decoded.accountPubkey, isSigner: true, isWritable: true }],
                args: { space: new anchor_1.BN(decoded.space) },
            };
            break;
        }
        case "AllocateWithSeed": {
            const decoded = web3_js_1.SystemInstruction.decodeAllocateWithSeed(instruction);
            parsed = {
                name: "allocateWithSeed",
                accounts: [
                    { name: "account", pubkey: decoded.accountPubkey, isSigner: false, isWritable: true },
                    { name: "base", pubkey: decoded.basePubkey, isSigner: true, isWritable: false },
                ],
                args: {
                    seed: decoded.seed,
                    space: new anchor_1.BN(decoded.space),
                    owner: decoded.programId,
                    base: decoded.basePubkey,
                },
            };
            break;
        }
        case "Assign": {
            const decoded = web3_js_1.SystemInstruction.decodeAssign(instruction);
            parsed = {
                name: "assign",
                accounts: [{ name: "pubkey", pubkey: decoded.accountPubkey, isSigner: true, isWritable: true }],
                args: { owner: decoded.programId },
            };
            break;
        }
        case "AssignWithSeed": {
            const decoded = web3_js_1.SystemInstruction.decodeAssignWithSeed(instruction);
            parsed = {
                name: "assignWithSeed",
                accounts: [
                    { name: "account", pubkey: decoded.accountPubkey, isSigner: false, isWritable: true },
                    { name: "base", pubkey: decoded.basePubkey, isSigner: true, isWritable: false },
                ],
                args: {
                    seed: decoded.seed, // string
                    owner: decoded.programId,
                    base: decoded.basePubkey,
                },
            };
            break;
        }
        case "AuthorizeNonceAccount": {
            const decoded = web3_js_1.SystemInstruction.decodeNonceAuthorize(instruction);
            parsed = {
                name: "authorizeNonceAccount",
                accounts: [
                    { name: "nonce", isSigner: false, isWritable: true, pubkey: decoded.noncePubkey },
                    { name: "authorized", isSigner: true, isWritable: false, pubkey: decoded.authorizedPubkey },
                ],
                args: { authorized: decoded.newAuthorizedPubkey },
            };
            break;
        }
        case "Create": {
            const decoded = web3_js_1.SystemInstruction.decodeCreateAccount(instruction);
            parsed = {
                name: "createAccount",
                accounts: [
                    { name: "from", pubkey: decoded.fromPubkey, isSigner: true, isWritable: true },
                    { name: "to", pubkey: decoded.newAccountPubkey, isSigner: true, isWritable: true },
                ],
                args: { lamports: new anchor_1.BN(decoded.lamports), owner: decoded.programId, space: new anchor_1.BN(decoded.space) },
            };
            break;
        }
        case "CreateWithSeed": {
            const decoded = web3_js_1.SystemInstruction.decodeCreateWithSeed(instruction);
            parsed = {
                name: "createAccountWithSeed",
                accounts: [
                    { name: "from", pubkey: decoded.fromPubkey, isSigner: true, isWritable: true },
                    { name: "to", pubkey: decoded.newAccountPubkey, isSigner: false, isWritable: true },
                    { name: "base", pubkey: decoded.basePubkey, isSigner: true, isWritable: false },
                ],
                args: {
                    lamports: new anchor_1.BN(decoded.lamports),
                    owner: decoded.programId,
                    space: new anchor_1.BN(decoded.space),
                    seed: decoded.seed,
                    base: decoded.basePubkey,
                },
            };
            break;
        }
        case "InitializeNonceAccount": {
            const decoded = web3_js_1.SystemInstruction.decodeNonceInitialize(instruction);
            parsed = {
                name: "initializeNonceAccount",
                accounts: [
                    { name: "nonce", pubkey: decoded.noncePubkey, isSigner: true, isWritable: true },
                    { name: "recentBlockhashes", isSigner: false, isWritable: false, pubkey: instruction.keys[1].pubkey },
                    { name: "rent", isSigner: false, isWritable: false, pubkey: instruction.keys[2].pubkey },
                ],
                args: { authorized: decoded.authorizedPubkey },
            };
            break;
        }
        case "Transfer": {
            const decoded = web3_js_1.SystemInstruction.decodeTransfer(instruction);
            parsed = {
                name: "transfer",
                accounts: [
                    { name: "from", pubkey: decoded.fromPubkey, isSigner: true, isWritable: true },
                    { name: "to", pubkey: decoded.toPubkey, isWritable: true, isSigner: false },
                ],
                args: { lamports: new anchor_1.BN(decoded.lamports.toString()) },
            };
            break;
        }
        case "TransferWithSeed": {
            const decoded = web3_js_1.SystemInstruction.decodeTransferWithSeed(instruction);
            parsed = {
                name: "transferWithSeed",
                accounts: [
                    { name: "from", pubkey: decoded.fromPubkey, isSigner: false, isWritable: true },
                    { name: "base", pubkey: decoded.basePubkey, isSigner: true, isWritable: false },
                    { name: "to", pubkey: decoded.toPubkey, isSigner: false, isWritable: true },
                ],
                args: { owner: decoded.programId, lamports: new anchor_1.BN(decoded.lamports.toString()), seed: decoded.seed },
            };
            break;
        }
        case "WithdrawNonceAccount": {
            const decoded = web3_js_1.SystemInstruction.decodeNonceWithdraw(instruction);
            parsed = {
                name: "withdrawNonceAccount",
                accounts: [
                    { name: "nonce", pubkey: decoded.noncePubkey, isSigner: false, isWritable: true },
                    { name: "to", pubkey: decoded.toPubkey, isSigner: false, isWritable: true },
                    { name: "recentBlockhashes", isSigner: false, isWritable: false, pubkey: instruction.keys[2].pubkey },
                    { name: "rent", isSigner: false, isWritable: false, pubkey: instruction.keys[3].pubkey },
                    { name: "authorized", pubkey: decoded.noncePubkey, isSigner: true, isWritable: false },
                ],
                args: { lamports: new anchor_1.BN(decoded.lamports) },
            };
            break;
        }
        default: {
            parsed = null;
        }
    }
    return parsed
        ? {
            ...parsed,
            programId: web3_js_1.SystemProgram.programId,
        }
        : {
            programId: web3_js_1.SystemProgram.programId,
            name: "unknown",
            accounts: instruction.keys,
            args: { unknown: instruction.data },
        };
}
//# sourceMappingURL=system.js.map