"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeTokenInstruction = decodeTokenInstruction;
const spl_token_1 = require("@solana/spl-token");
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
function decodeTokenInstruction(instruction) {
    let parsed = null;
    const decoded = instruction.data[0];
    switch (decoded) {
        case spl_token_1.TokenInstruction.InitializeMint: {
            const decodedIx = (0, spl_token_1.decodeInitializeMintInstructionUnchecked)(instruction);
            parsed = {
                name: "initializeMint",
                accounts: [
                    { name: "mint", isSigner: false, isWritable: true, pubkey: instruction.keys[0].pubkey },
                    { name: "rent", isSigner: false, isWritable: false, pubkey: instruction.keys[1].pubkey },
                ],
                args: { decimals: decodedIx.data.decimals, mintAuthority: decodedIx.data.mintAuthority, freezeAuthority: decodedIx.data.freezeAuthority },
            };
            break;
        }
        case spl_token_1.TokenInstruction.InitializeAccount: {
            const decodedIx = (0, spl_token_1.decodeInitializeAccountInstruction)(instruction);
            parsed = {
                name: "initializeAccount",
                accounts: [
                    { name: "account", ...decodedIx.keys.account },
                    { name: "mint", ...decodedIx.keys.mint },
                    { name: "owner", ...decodedIx.keys.owner },
                    { name: "rent", ...decodedIx.keys.rent },
                ],
                args: {},
            };
            break;
        }
        case spl_token_1.TokenInstruction.InitializeMultisig: {
            const decodedIx = (0, spl_token_1.decodeInitializeMultisigInstruction)(instruction);
            const multisig = decodedIx.keys.signers.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "initializeMultisig",
                accounts: [{ name: "multisig", ...decodedIx.keys.account }, { name: "rent", ...decodedIx.keys.rent }, ...multisig],
                args: { m: decodedIx.data.m },
            };
            break;
        }
        case spl_token_1.TokenInstruction.Transfer: {
            const decodedIx = (0, spl_token_1.decodeTransferInstruction)(instruction);
            const multisig = decodedIx.keys.multiSigners.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "transfer",
                accounts: [
                    { name: "source", ...decodedIx.keys.source },
                    { name: "destination", ...decodedIx.keys.destination },
                    { name: "authority", ...decodedIx.keys.owner },
                    ...multisig,
                ],
                args: { amount: new anchor_1.BN(decodedIx.data.amount.toString()) },
            };
            break;
        }
        case spl_token_1.TokenInstruction.Approve: {
            const decodedIx = (0, spl_token_1.decodeApproveInstruction)(instruction);
            const multisig = decodedIx.keys.multiSigners.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "approve",
                accounts: [
                    { name: "source", ...decodedIx.keys.account },
                    { name: "delegate", ...decodedIx.keys.delegate },
                    { name: "owner", ...decodedIx.keys.owner },
                    ...multisig,
                ],
                args: { amount: new anchor_1.BN(decodedIx.data.amount.toString()) },
            };
            break;
        }
        case spl_token_1.TokenInstruction.Revoke: {
            const decodedIx = (0, spl_token_1.decodeRevokeInstruction)(instruction);
            const multisig = decodedIx.keys.multiSigners.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "revoke",
                accounts: [{ name: "source", ...decodedIx.keys.account }, { name: "owner", ...decodedIx.keys.owner }, ...multisig],
                args: {},
            };
            break;
        }
        case spl_token_1.TokenInstruction.SetAuthority: {
            const decodedIx = (0, spl_token_1.decodeSetAuthorityInstruction)(instruction);
            const authrorityTypeMap = {
                [spl_token_1.AuthorityType.AccountOwner]: { accountOwner: {} },
                [spl_token_1.AuthorityType.CloseAccount]: { closeAccount: {} },
                [spl_token_1.AuthorityType.FreezeAccount]: { freezeAccount: {} },
                [spl_token_1.AuthorityType.MintTokens]: { mintTokens: {} },
            };
            if (![spl_token_1.AuthorityType.AccountOwner, spl_token_1.AuthorityType.CloseAccount, spl_token_1.AuthorityType.FreezeAccount, spl_token_1.AuthorityType.MintTokens].includes(decodedIx.data.authorityType)) {
                throw new Error("Unexpected authority type for token program");
            }
            const multisig = decodedIx.keys.multiSigners.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "setAuthority",
                accounts: [{ name: "owned", ...decodedIx.keys.account }, { name: "owner", ...decodedIx.keys.currentAuthority }, ...multisig],
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                args: { authorityType: authrorityTypeMap[decodedIx.data.authorityType], newAuthority: decodedIx.data.newAuthority },
            };
            break;
        }
        case spl_token_1.TokenInstruction.MintTo: {
            const decodedIx = (0, spl_token_1.decodeMintToInstruction)(instruction);
            const multisig = decodedIx.keys.multiSigners.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "mintTo",
                accounts: [
                    { name: "mint", ...decodedIx.keys.mint },
                    { name: "account", ...decodedIx.keys.destination },
                    { name: "owner", ...decodedIx.keys.authority },
                    ...multisig,
                ],
                args: { amount: new anchor_1.BN(decodedIx.data.amount.toString()) },
            };
            break;
        }
        case spl_token_1.TokenInstruction.Burn: {
            const decodedIx = (0, spl_token_1.decodeBurnInstruction)(instruction);
            const multisig = decodedIx.keys.multiSigners.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "burn",
                accounts: [
                    { name: "account", ...decodedIx.keys.account },
                    { name: "mint", ...decodedIx.keys.mint },
                    { name: "authority", ...decodedIx.keys.owner },
                    ...multisig,
                ],
                args: { amount: new anchor_1.BN(decodedIx.data.amount.toString()) },
            };
            break;
        }
        case spl_token_1.TokenInstruction.CloseAccount: {
            const decodedIx = (0, spl_token_1.decodeCloseAccountInstruction)(instruction);
            const multisig = decodedIx.keys.multiSigners.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "closeAccount",
                accounts: [
                    { name: "account", ...decodedIx.keys.account },
                    { name: "destination", ...decodedIx.keys.destination },
                    { name: "owner", ...decodedIx.keys.authority },
                    ...multisig,
                ],
                args: {},
            };
            break;
        }
        case spl_token_1.TokenInstruction.FreezeAccount: {
            const decodedIx = (0, spl_token_1.decodeFreezeAccountInstruction)(instruction);
            const multisig = decodedIx.keys.multiSigners.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "freezeAccount",
                accounts: [
                    { name: "account", ...decodedIx.keys.account },
                    { name: "mint", ...decodedIx.keys.mint },
                    { name: "owner", ...decodedIx.keys.authority },
                    ...multisig,
                ],
                args: {},
            };
            break;
        }
        case spl_token_1.TokenInstruction.ThawAccount: {
            const decodedIx = (0, spl_token_1.decodeThawAccountInstruction)(instruction);
            const multisig = decodedIx.keys.multiSigners.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "thawAccount",
                accounts: [
                    { name: "account", ...decodedIx.keys.account },
                    { name: "mint", ...decodedIx.keys.mint },
                    { name: "owner", ...decodedIx.keys.authority },
                    ...multisig,
                ],
                args: {},
            };
            break;
        }
        case spl_token_1.TokenInstruction.TransferChecked: {
            const decodedIx = (0, spl_token_1.decodeTransferCheckedInstruction)(instruction);
            const multisig = decodedIx.keys.multiSigners.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "transferChecked",
                accounts: [
                    { name: "source", ...decodedIx.keys.source },
                    { name: "mint", ...decodedIx.keys.mint },
                    { name: "destination", ...decodedIx.keys.destination },
                    { name: "authority", ...decodedIx.keys.owner },
                    ...multisig,
                ],
                args: { amount: new anchor_1.BN(decodedIx.data.amount.toString()), decimals: decodedIx.data.decimals },
            };
            break;
        }
        case spl_token_1.TokenInstruction.ApproveChecked: {
            const decodedIx = (0, spl_token_1.decodeApproveCheckedInstruction)(instruction);
            const multisig = decodedIx.keys.multiSigners.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "approveChecked",
                accounts: [
                    { name: "source", ...decodedIx.keys.account },
                    { name: "mint", ...decodedIx.keys.mint },
                    { name: "delegate", ...decodedIx.keys.delegate },
                    { name: "owner", ...decodedIx.keys.owner },
                    ...multisig,
                ],
                args: { amount: new anchor_1.BN(decodedIx.data.amount.toString()), decimals: decodedIx.data.decimals },
            };
            break;
        }
        case spl_token_1.TokenInstruction.MintToChecked: {
            const decodedIx = (0, spl_token_1.decodeMintToCheckedInstruction)(instruction);
            const multisig = decodedIx.keys.multiSigners.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "mintToChecked",
                accounts: [
                    { name: "mint", ...decodedIx.keys.mint },
                    { name: "account", ...decodedIx.keys.destination },
                    { name: "owner", ...decodedIx.keys.authority },
                    ...multisig,
                ],
                args: { amount: new anchor_1.BN(decodedIx.data.amount.toString()), decimals: decodedIx.data.decimals },
            };
            break;
        }
        case spl_token_1.TokenInstruction.BurnChecked: {
            const decodedIx = (0, spl_token_1.decodeBurnCheckedInstruction)(instruction);
            const multisig = decodedIx.keys.multiSigners.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "burnChecked",
                accounts: [
                    { name: "account", ...decodedIx.keys.account },
                    { name: "mint", ...decodedIx.keys.mint },
                    { name: "authority", ...decodedIx.keys.owner },
                    ...multisig,
                ],
                args: { amount: new anchor_1.BN(decodedIx.data.amount.toString()), decimals: decodedIx.data.decimals },
            };
            break;
        }
        case spl_token_1.TokenInstruction.InitializeAccount2: {
            const decodedIx = (0, spl_token_1.decodeInitializeAccount2Instruction)(instruction);
            parsed = {
                name: "initializeAccount2",
                accounts: [
                    { name: "account", ...decodedIx.keys.account },
                    { name: "mint", ...decodedIx.keys.mint },
                    { name: "rent", ...decodedIx.keys.rent },
                ],
                args: { owner: new web3_js_1.PublicKey(decodedIx.data.owner) },
            };
            break;
        }
        case spl_token_1.TokenInstruction.SyncNative: {
            const decodedIx = (0, spl_token_1.decodeSyncNativeInstruction)(instruction);
            parsed = {
                name: "syncNative",
                accounts: [{ name: "account", ...decodedIx.keys.account }],
                args: {},
            };
            break;
        }
        case spl_token_1.TokenInstruction.InitializeAccount3: {
            const decodedIx = (0, spl_token_1.decodeInitializeAccount3Instruction)(instruction);
            parsed = {
                name: "initializeAccount3",
                accounts: [
                    { name: "account", ...decodedIx.keys.account },
                    { name: "mint", ...decodedIx.keys.mint },
                ],
                args: { owner: new web3_js_1.PublicKey(decodedIx.data.owner) },
            };
            break;
        }
        case spl_token_1.TokenInstruction.InitializeMultisig2: {
            const multisig = instruction.keys.slice(1).map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "initializeMultisig2",
                accounts: [{ name: "multisig", ...instruction.keys[0] }, ...multisig],
                args: { m: instruction.data[1] },
            };
            break;
        }
        case spl_token_1.TokenInstruction.InitializeMint2: {
            const decodedIx = (0, spl_token_1.decodeInitializeMint2Instruction)(instruction);
            const tokenMint = decodedIx.keys.mint;
            if (!tokenMint)
                throw new Error(`Failed to parse InitializeMint2 instruction`);
            parsed = {
                name: "initializeMint2",
                accounts: [{ name: "mint", ...tokenMint }],
                args: { decimals: decodedIx.data.decimals, mintAuthority: decodedIx.data.mintAuthority, freezeAuthority: decodedIx.data.freezeAuthority },
            };
            break;
        }
        case spl_token_1.TokenInstruction.InitializeImmutableOwner: {
            const decodedIx = (0, spl_token_1.decodeInitializeImmutableOwnerInstruction)(instruction, instruction.programId);
            parsed = {
                name: "initializeImmutableOwner",
                accounts: [{ name: "account", ...decodedIx.keys.account }],
                args: {},
            };
            break;
        }
        case spl_token_1.TokenInstruction.AmountToUiAmount: {
            const decodedIx = (0, spl_token_1.decodeAmountToUiAmountInstruction)(instruction);
            parsed = {
                name: "amountToUiAmount",
                accounts: [{ name: "mint", ...decodedIx.keys.mint }],
                args: { amount: new anchor_1.BN(decodedIx.data.amount.toString()) },
            };
            break;
        }
        case spl_token_1.TokenInstruction.UiAmountToAmount: {
            const decodedIx = (0, spl_token_1.decodeUiAmountToAmountInstruction)(instruction);
            parsed = {
                name: "uiAmountToAmount",
                accounts: [{ name: "mint", ...decodedIx.keys.mint }],
                args: { uiAmount: new anchor_1.BN(decodedIx.data.amount).toString() },
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
            programId: spl_token_1.TOKEN_PROGRAM_ID,
        }
        : {
            programId: spl_token_1.TOKEN_PROGRAM_ID,
            name: "unknown",
            accounts: instruction.keys,
            args: { unknown: instruction.data },
        };
}
//# sourceMappingURL=token.js.map