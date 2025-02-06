"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken2022Instruction = decodeToken2022Instruction;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const anchor_1 = require("@coral-xyz/anchor");
const spl_type_length_value_1 = require("@solana/spl-type-length-value");
const token_extensions_1 = require("../programs/token-extensions");
function decodeToken2022Instruction(instruction) {
    let parsed;
    const decoded = instruction.data[0];
    switch (decoded) {
        case spl_token_1.TokenInstruction.InitializeMint: {
            const decodedIx = (0, spl_token_1.decodeInitializeMintInstructionUnchecked)(instruction);
            parsed = {
                name: "initializeMint",
                accounts: [
                    { name: "mint", ...decodedIx.keys.mint },
                    { name: "rent", ...decodedIx.keys.rent },
                ],
                args: { decimals: decodedIx.data.decimals, mintAuthority: decodedIx.data.mintAuthority, freezeAuthority: decodedIx.data.freezeAuthority },
            };
            break;
        }
        case spl_token_1.TokenInstruction.InitializeAccount: {
            const decodedIx = (0, spl_token_1.decodeInitializeAccountInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
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
            const decodedIx = (0, spl_token_1.decodeInitializeMultisigInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
            const multisig = decodedIx.keys.signers.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "initializeMultisig",
                accounts: [{ name: "multisig", ...decodedIx.keys.account }, { name: "rent", ...decodedIx.keys.rent }, ...multisig],
                args: { m: decodedIx.data.m },
            };
            break;
        }
        case spl_token_1.TokenInstruction.Transfer: {
            const decodedIx = (0, spl_token_1.decodeTransferInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
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
            const decodedIx = (0, spl_token_1.decodeApproveInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
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
            const decodedIx = (0, spl_token_1.decodeRevokeInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
            const multisig = decodedIx.keys.multiSigners.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            parsed = {
                name: "revoke",
                accounts: [{ name: "source", ...decodedIx.keys.account }, { name: "owner", ...decodedIx.keys.owner }, ...multisig],
                args: {},
            };
            break;
        }
        case spl_token_1.TokenInstruction.SetAuthority: {
            const decodedIx = (0, spl_token_1.decodeSetAuthorityInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
            const multisig = decodedIx.keys.multiSigners.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            const authrorityTypeMap = {
                [spl_token_1.AuthorityType.AccountOwner]: { AccountOwner: {} },
                [spl_token_1.AuthorityType.CloseAccount]: { CloseAccount: {} },
                [spl_token_1.AuthorityType.FreezeAccount]: { FreezeAccount: {} },
                [spl_token_1.AuthorityType.MintTokens]: { MintTokens: {} },
                [spl_token_1.AuthorityType.CloseMint]: { CloseMint: {} },
                [spl_token_1.AuthorityType.ConfidentialTransferFeeConfig]: { ConfidentialTransferFeeConfig: {} },
                [spl_token_1.AuthorityType.ConfidentialTransferMint]: { ConfidentialTransferMint: {} },
                [spl_token_1.AuthorityType.GroupMemberPointer]: { GroupMemberPointer: {} },
                [spl_token_1.AuthorityType.GroupPointer]: { GroupPointer: {} },
                [spl_token_1.AuthorityType.InterestRate]: { InterestRate: {} },
                [spl_token_1.AuthorityType.MetadataPointer]: { MetadataPointer: {} },
                [spl_token_1.AuthorityType.PermanentDelegate]: { PermanentDelegate: {} },
                [spl_token_1.AuthorityType.TransferFeeConfig]: { TransferFeeConfig: {} },
                [spl_token_1.AuthorityType.TransferHookProgramId]: { TransferHookProgramId: {} },
                [spl_token_1.AuthorityType.WithheldWithdraw]: { WithheldWithdraw: {} },
            };
            parsed = {
                name: "setAuthority",
                accounts: [{ name: "owned", ...decodedIx.keys.account }, { name: "owner", ...decodedIx.keys.currentAuthority }, ...multisig],
                args: { authorityType: authrorityTypeMap[decodedIx.data.authorityType], newAuthority: decodedIx.data.newAuthority },
                programId: spl_token_1.TOKEN_2022_PROGRAM_ID,
            };
            break;
        }
        case spl_token_1.TokenInstruction.MintTo: {
            const decodedIx = (0, spl_token_1.decodeMintToInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
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
            const decodedIx = (0, spl_token_1.decodeBurnInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
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
            const decodedIx = (0, spl_token_1.decodeCloseAccountInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
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
            const decodedIx = (0, spl_token_1.decodeFreezeAccountInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
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
            const decodedIx = (0, spl_token_1.decodeThawAccountInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
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
            const decodedIx = (0, spl_token_1.decodeTransferCheckedInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
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
            const decodedIx = (0, spl_token_1.decodeApproveCheckedInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
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
            const decodedIx = (0, spl_token_1.decodeMintToCheckedInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
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
            const decodedIx = (0, spl_token_1.decodeBurnCheckedInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
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
            const decodedIx = (0, spl_token_1.decodeInitializeAccount2Instruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
            parsed = {
                name: "initializeAccount2",
                accounts: [
                    { name: "account", ...instruction.keys[0] },
                    { name: "mint", ...instruction.keys[1] },
                    { name: "rent", ...instruction.keys[2] },
                ],
                args: { owner: new web3_js_1.PublicKey(decodedIx.data.owner) },
            };
            break;
        }
        case spl_token_1.TokenInstruction.SyncNative: {
            parsed = {
                name: "syncNative",
                accounts: [{ name: "account", ...instruction.keys[0] }],
                args: {},
            };
            break;
        }
        case spl_token_1.TokenInstruction.InitializeAccount3: {
            const decodedIx = (0, spl_token_1.decodeInitializeAccount3Instruction)(instruction, instruction.programId);
            parsed = {
                name: "initializeAccount3",
                accounts: [
                    { name: "account", ...instruction.keys[0] },
                    { name: "mint", ...instruction.keys[1] },
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
            const decodedIx = (0, spl_token_1.decodeInitializeMint2Instruction)(instruction, instruction.programId);
            const tokenMint = decodedIx.keys.mint;
            if (!tokenMint)
                throw new Error(`Failed to parse InitializeMint2 instruction`);
            parsed = {
                name: "initializeMint2",
                accounts: [{ name: "mint", ...decodedIx.keys.mint }],
                args: { decimals: decodedIx.data.decimals, mintAuthority: decodedIx.data.mintAuthority, freezeAuthority: decodedIx.data.freezeAuthority },
            };
            break;
        }
        case spl_token_1.TokenInstruction.GetAccountDataSize: {
            const tokenMint = instruction.keys[0].pubkey;
            if (!tokenMint)
                throw new Error(`Failed to parse GetAccountDataSize instruction`);
            const instructionData = token_extensions_1.getAccountDataSizeLayout.decode(instruction.data);
            const types = instructionData.extensions.map((ext) => ({
                [spl_token_1.ExtensionType[ext]]: {},
            }));
            parsed = {
                name: "getAccountDataSize",
                programId: instruction.programId,
                accounts: [{ name: "mint", isSigner: false, isWritable: false, pubkey: instruction.keys[0].pubkey }],
                args: {
                    extensionTypes: types,
                },
            };
            break;
        }
        case spl_token_1.TokenInstruction.InitializeImmutableOwner: {
            const decodedIx = (0, spl_token_1.decodeInitializeImmutableOwnerInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
            const account = decodedIx.keys.account;
            if (!account)
                throw new Error(`Failed to parse InitializeImmutableOwner instruction`);
            parsed = {
                name: "initializeImmutableOwner",
                accounts: [{ name: "tokenAccount", ...decodedIx.keys.account }],
                args: {},
            };
            break;
        }
        case spl_token_1.TokenInstruction.AmountToUiAmount: {
            const decodedIx = (0, spl_token_1.decodeAmountToUiAmountInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
            const tokenMint = decodedIx.keys.mint;
            if (!tokenMint)
                throw new Error(`Failed to parse AmountToUiAmount instruction`);
            parsed = {
                name: "amountToUiAmount",
                accounts: [{ name: "mint", ...decodedIx.keys.mint }],
                args: { amount: new anchor_1.BN(decodedIx.data.amount.toString()) },
            };
            break;
        }
        case spl_token_1.TokenInstruction.UiAmountToAmount: {
            const decodedIx = (0, spl_token_1.decodeUiAmountToAmountInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
            const tokenMint = decodedIx.keys.mint;
            if (!tokenMint)
                throw new Error(`Failed to parse UiAmountToAmount instruction`);
            parsed = {
                name: "uiAmountToAmount",
                accounts: [{ name: "mint", ...decodedIx.keys.mint }],
                args: { uiAmount: decodedIx.data.amount },
            };
            break;
        }
        case spl_token_1.TokenInstruction.InitializeMintCloseAuthority: {
            const decodedIx = (0, spl_token_1.decodeInitializeMintCloseAuthorityInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
            const tokenMint = decodedIx.keys.mint;
            if (!tokenMint)
                throw new Error(`Failed to parse InitializeMintCloseAuthority instruction`);
            parsed = {
                name: "initializeMintCloseAuthority",
                accounts: [{ name: "mint", ...decodedIx.keys.mint }],
                args: { closeAuthority: decodedIx.data.closeAuthority },
            };
            break;
        }
        case spl_token_1.TokenInstruction.CreateNativeMint: {
            const payer = instruction.keys[0].pubkey;
            if (!payer)
                throw new Error(`Failed to parse CreateNativeMint instruction`);
            parsed = {
                name: "createNativeMint",
                accounts: [
                    { name: "payer", isSigner: true, isWritable: true, pubkey: instruction.keys[0].pubkey },
                    { name: "crateNativeMint", isSigner: false, isWritable: true, pubkey: instruction.keys[1].pubkey },
                    { name: "systemProgram", isSigner: false, isWritable: false, pubkey: instruction.keys[2].pubkey },
                ],
                args: {},
            };
            break;
        }
        case spl_token_1.TokenInstruction.TransferFeeExtension: {
            const discriminator = instruction.data[1];
            switch (discriminator) {
                case spl_token_1.TransferFeeInstruction.InitializeTransferFeeConfig: {
                    const decodedIx = (0, spl_token_1.decodeInitializeTransferFeeConfigInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
                    const tokenMint = decodedIx.keys.mint;
                    if (!tokenMint)
                        throw new Error(`Failed to parse InitializeTransferFeeConfig instruction`);
                    parsed = {
                        name: "initializeTransferFeeConfig",
                        accounts: [{ name: "mint", ...decodedIx.keys.mint }],
                        args: {
                            transferFeeConfigAuthority: decodedIx.data.transferFeeConfigAuthority,
                            withdrawWithheldAuthority: decodedIx.data.withdrawWithheldAuthority,
                            transferFeeBasisPoints: decodedIx.data.transferFeeBasisPoints,
                            maximumFee: decodedIx.data.maximumFee,
                        },
                    };
                    break;
                }
                case spl_token_1.TransferFeeInstruction.TransferCheckedWithFee: {
                    const decodedIx = (0, spl_token_1.decodeTransferCheckedWithFeeInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
                    const tokenMint = decodedIx.keys.mint;
                    if (!tokenMint)
                        throw new Error(`Failed to parse TransferCheckedWithFee instruction`);
                    parsed = {
                        name: "transferCheckedWithFee",
                        accounts: [
                            { name: "source", ...decodedIx.keys.source },
                            { name: "mint", ...decodedIx.keys.mint },
                            { name: "destination", ...decodedIx.keys.destination },
                            { name: "authority", ...decodedIx.keys.authority },
                        ],
                        args: {
                            amount: decodedIx.data.amount,
                            decimals: decodedIx.data.decimals,
                            fee: decodedIx.data.fee,
                        },
                    };
                    if (decodedIx.keys.signers) {
                        const multisig = decodedIx.keys.signers.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
                        // @ts-ignore - Expression produces a union type that is too complex to represent. We don't need type checks here
                        parsed.accounts.push(...multisig);
                    }
                    break;
                }
                case spl_token_1.TransferFeeInstruction.WithdrawWithheldTokensFromMint: {
                    const decodedIx = (0, spl_token_1.decodeWithdrawWithheldTokensFromMintInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
                    const tokenMint = decodedIx.keys.mint;
                    if (!tokenMint)
                        throw new Error(`Failed to parse WithdrawWithheldTokensFromMint instruction`);
                    parsed = {
                        name: "withdrawWithheldTokensFromMint",
                        accounts: [
                            { name: "mint", ...decodedIx.keys.mint },
                            { name: "destination", ...decodedIx.keys.destination },
                            { name: "authority", ...decodedIx.keys.authority },
                        ],
                        args: {},
                    };
                    if (decodedIx.keys.signers) {
                        const multisig = decodedIx.keys.signers.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
                        parsed.accounts.push(...multisig);
                    }
                    break;
                }
                case spl_token_1.TransferFeeInstruction.WithdrawWithheldTokensFromAccounts: {
                    const decodedIx = (0, spl_token_1.decodeWithdrawWithheldTokensFromAccountsInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
                    const tokenMint = decodedIx.keys.mint;
                    if (!tokenMint)
                        throw new Error(`Failed to parse WithdrawWithheldTokensFromAccounts instruction`);
                    parsed = {
                        name: "withdrawWithheldTokensFromAccounts",
                        accounts: [
                            { name: "mint", ...decodedIx.keys.mint },
                            { name: "destination", ...decodedIx.keys.destination },
                            { name: "authority", ...decodedIx.keys.authority },
                        ],
                        args: {},
                    };
                    if (decodedIx.keys.signers) {
                        const multisig = decodedIx.keys.signers.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
                        parsed.accounts.push(...multisig);
                    }
                    if (decodedIx.keys.sources) {
                        const multisig = decodedIx.keys.sources.map((meta, idx) => ({ name: `source_${idx}`, ...meta }));
                        parsed.accounts.push(...multisig);
                    }
                    break;
                }
                case spl_token_1.TransferFeeInstruction.HarvestWithheldTokensToMint: {
                    const decodedIx = (0, spl_token_1.decodeHarvestWithheldTokensToMintInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
                    const tokenMint = decodedIx.keys.mint;
                    if (!tokenMint)
                        throw new Error(`Failed to parse HarvestWithheldTokensToMint instruction`);
                    parsed = {
                        name: "harvestWithheldTokensToMint",
                        accounts: [{ name: "mint", ...decodedIx.keys.mint }],
                        args: {},
                    };
                    if (decodedIx.keys.sources) {
                        const multisig = decodedIx.keys.sources.map((meta, idx) => ({ name: `source_${idx}`, ...meta }));
                        parsed.accounts.push(...multisig);
                    }
                    break;
                }
                case spl_token_1.TransferFeeInstruction.SetTransferFee: {
                    const decodedIx = (0, spl_token_1.decodeSetTransferFeeInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
                    const tokenMint = decodedIx.keys.mint;
                    if (!tokenMint)
                        throw new Error(`Failed to parse SetTransferFee instruction`);
                    parsed = {
                        name: "setTransferFee",
                        accounts: [
                            { name: "mint", ...decodedIx.keys.mint },
                            { name: "authority", ...decodedIx.keys.authority },
                        ],
                        args: { transferFeeBasisPoints: decodedIx.data.transferFeeBasisPoints, maximumFee: decodedIx.data.maximumFee },
                    };
                    if (decodedIx.keys.signers) {
                        const multisig = decodedIx.keys.signers.map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
                        parsed.accounts.push(...multisig);
                    }
                    break;
                }
                default: {
                    parsed = null;
                    break;
                }
            }
            break;
        }
        case spl_token_1.TokenInstruction.DefaultAccountStateExtension: {
            const discriminator = instruction.data[1];
            switch (discriminator) {
                case spl_token_1.DefaultAccountStateInstruction.Initialize: {
                    const tokenMint = instruction.keys[0].pubkey;
                    if (!tokenMint)
                        throw new Error(`Failed to parse InitializeDefaultAccountState instruction`);
                    const instructionData = spl_token_1.defaultAccountStateInstructionData.decode(instruction.data);
                    parsed = {
                        name: "initializeDefaultAccountState",
                        accounts: [{ name: "mint", ...instruction.keys[0] }],
                        args: { accountState: spl_token_1.AccountState[instructionData.accountState] },
                    };
                    break;
                }
                case spl_token_1.DefaultAccountStateInstruction.Update: {
                    const tokenMint = instruction.keys[0].pubkey;
                    if (!tokenMint)
                        throw new Error(`Failed to parse UpdateDefaultAccountState instruction`);
                    const multisig = instruction.keys.slice(2).map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
                    const instructionData = spl_token_1.defaultAccountStateInstructionData.decode(instruction.data);
                    parsed = {
                        name: "updateDefaultAccountState",
                        accounts: [{ name: "mint", ...instruction.keys[0] }, { name: "freezeAuthority", ...instruction.keys[1] }, { ...multisig }],
                        args: { accountState: spl_token_1.AccountState[instructionData.accountState] },
                    };
                    break;
                }
                default: {
                    parsed = null;
                    break;
                }
            }
            break;
        }
        case spl_token_1.TokenInstruction.MemoTransferExtension: {
            const account = instruction.keys[0].pubkey;
            if (!account)
                throw new Error(`Failed to parse MemoTransfersInstruction instruction`);
            const instructionData = spl_token_1.memoTransferInstructionData.decode(instruction.data);
            parsed = {
                name: "memoTransfersInstruction",
                accounts: [{ name: "account", ...instruction.keys[0] }, { name: "authority", ...instruction.keys[1] }, { ...instruction.keys.slice(2) }],
                args: { memoTransferInstruction: spl_token_1.MemoTransferInstruction[instructionData.memoTransferInstruction] },
            };
            break;
        }
        case spl_token_1.TokenInstruction.InitializeNonTransferableMint: {
            const mint = instruction.keys[0].pubkey;
            if (!mint)
                throw new Error(`Failed to parse InitializeNonTransferableMint instruction`);
            parsed = {
                name: "initializeNonTransferableMint",
                accounts: [{ name: "mint", ...instruction.keys[0] }],
                args: {},
            };
            break;
        }
        case spl_token_1.TokenInstruction.CpiGuardExtension: {
            const account = instruction.keys[0].pubkey;
            if (!account)
                throw new Error(`Failed to parse CreateCpiGuardInstruction instruction`);
            const multisig = instruction.keys.slice(2).map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
            const instructionData = spl_token_1.cpiGuardInstructionData.decode(instruction.data);
            parsed = {
                name: "createCpiGuardInstruction",
                accounts: [{ name: "account", ...instruction.keys[0] }, { name: "authority", ...instruction.keys[1] }, { ...multisig }],
                args: { cpiGuardInstruction: spl_token_1.CpiGuardInstruction[instructionData.cpiGuardInstruction] },
            };
            break;
        }
        case spl_token_1.TokenInstruction.InitializePermanentDelegate: {
            const mint = instruction.keys[0].pubkey;
            if (!mint)
                throw new Error(`Failed to parse InitializePermanentDelegate instruction`);
            const decodedIx = (0, spl_token_1.decodeInitializePermanentDelegateInstruction)(instruction, spl_token_1.TOKEN_2022_PROGRAM_ID);
            parsed = {
                name: "initializePermanentDelegate",
                accounts: [{ name: "account", ...decodedIx.keys.mint }],
                args: { delegate: decodedIx.data.delegate },
            };
            break;
        }
        case spl_token_1.TokenInstruction.TransferHookExtension: {
            const discriminator = instruction.data[1];
            switch (discriminator) {
                case spl_token_1.TransferHookInstruction.Initialize: {
                    const tokenMint = instruction.keys[0].pubkey;
                    if (!tokenMint)
                        throw new Error(`Failed to parse InitializeTransferHook instruction`);
                    const instructionData = spl_token_1.initializeTransferHookInstructionData.decode(instruction.data);
                    parsed = {
                        name: "initializeTransferHook",
                        accounts: [{ name: "mint", ...instruction.keys[0] }],
                        args: { authority: instructionData.authority, transferHookProgramId: instructionData.transferHookProgramId },
                    };
                    break;
                }
                case spl_token_1.TransferHookInstruction.Update: {
                    const tokenMint = instruction.keys[0].pubkey;
                    if (!tokenMint)
                        throw new Error(`Failed to parse UpdateTransferHook instruction`);
                    const multisig = instruction.keys.slice(2).map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
                    const instructionData = spl_token_1.updateTransferHookInstructionData.decode(instruction.data);
                    parsed = {
                        name: "updateTransferHook",
                        accounts: [{ name: "mint", ...instruction.keys[0] }, { name: "authority", ...instruction.keys[1] }, { ...multisig }],
                        args: { transferHookProgramId: instructionData.transferHookProgramId },
                    };
                    break;
                }
                default: {
                    parsed = null;
                    break;
                }
            }
            break;
        }
        case spl_token_1.TokenInstruction.MetadataPointerExtension: {
            const discriminator = instruction.data[1];
            switch (discriminator) {
                case spl_token_1.MetadataPointerInstruction.Initialize: {
                    const tokenMint = instruction.keys[0].pubkey;
                    if (!tokenMint)
                        throw new Error(`Failed to parse InitializeMetadataPointer instruction`);
                    const instructionData = spl_token_1.initializeMetadataPointerData.decode(instruction.data);
                    parsed = {
                        name: "initializeMetadataPointer",
                        accounts: [{ name: "mint", ...instruction.keys[0] }],
                        args: { authority: instructionData.authority, metadataAddress: instructionData.metadataAddress },
                    };
                    break;
                }
                case spl_token_1.MetadataPointerInstruction.Update: {
                    const tokenMint = instruction.keys[0].pubkey;
                    if (!tokenMint)
                        throw new Error(`Failed to parse UpdateMetadataPointer instruction`);
                    const multisig = instruction.keys.slice(2).map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
                    const instructionData = spl_token_1.updateMetadataPointerData.decode(instruction.data);
                    parsed = {
                        name: "updateMetadataPointer",
                        accounts: [{ name: "mint", ...instruction.keys[0] }, { name: "authority", ...instruction.keys[1] }, { ...multisig }],
                        args: { metadataAddress: instructionData.metadataAddress },
                    };
                    break;
                }
                default: {
                    parsed = null;
                    break;
                }
            }
            break;
        }
        case spl_token_1.TokenInstruction.GroupPointerExtension: {
            const discriminator = instruction.data[1];
            switch (discriminator) {
                case spl_token_1.GroupPointerInstruction.Initialize: {
                    const tokenMint = instruction.keys[0].pubkey;
                    if (!tokenMint)
                        throw new Error(`Failed to parse InitializeGroupPointer instruction`);
                    const instructionData = spl_token_1.initializeGroupPointerData.decode(instruction.data);
                    parsed = {
                        name: "initializeGroupPointer",
                        accounts: [{ name: "mint", ...instruction.keys[0] }],
                        args: { authority: instructionData.authority, groupAddress: instructionData.groupAddress },
                    };
                    break;
                }
                case spl_token_1.GroupPointerInstruction.Update: {
                    const tokenMint = instruction.keys[0].pubkey;
                    if (!tokenMint)
                        throw new Error(`Failed to parse UpdateGroupPointer instruction`);
                    const multisig = instruction.keys.slice(2).map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
                    const instructionData = spl_token_1.updateGroupPointerData.decode(instruction.data);
                    parsed = {
                        name: "updateGroupPointer",
                        accounts: [{ name: "mint", ...instruction.keys[0] }, { name: "authority", ...instruction.keys[1] }, { ...multisig }],
                        args: { groupAddress: instructionData.groupAddress },
                    };
                    break;
                }
                default: {
                    parsed = null;
                    break;
                }
            }
            break;
        }
        case spl_token_1.TokenInstruction.GroupMemberPointerExtension: {
            const discriminator = instruction.data[1];
            switch (discriminator) {
                case spl_token_1.GroupMemberPointerInstruction.Initialize: {
                    const tokenMint = instruction.keys[0].pubkey;
                    if (!tokenMint)
                        throw new Error(`Failed to parse InitializeGroupMemberPointer instruction`);
                    const instructionData = spl_token_1.initializeGroupMemberPointerData.decode(instruction.data);
                    parsed = {
                        name: "initializeGroupMemberPointer",
                        accounts: [{ name: "mint", ...instruction.keys[0] }],
                        args: { authority: instructionData.authority, memberAddress: instructionData.memberAddress },
                    };
                    break;
                }
                case spl_token_1.GroupMemberPointerInstruction.Update: {
                    const tokenMint = instruction.keys[0].pubkey;
                    if (!tokenMint)
                        throw new Error(`Failed to parse UpdateGroupMemberPointer instruction`);
                    const multisig = instruction.keys.slice(2).map((meta, idx) => ({ name: `signer_${idx}`, ...meta }));
                    const instructionData = spl_token_1.updateGroupMemberPointerData.decode(instruction.data);
                    parsed = {
                        name: "updateGroupMemberPointer",
                        accounts: [{ name: "mint", ...instruction.keys[0] }, { name: "authority", ...instruction.keys[1] }, { ...multisig }],
                        args: { memberAddress: instructionData.memberAddress },
                    };
                    break;
                }
                default: {
                    parsed = null;
                    break;
                }
            }
            break;
        }
        default: {
            const discriminator = instruction.data.slice(0, 8).toString("hex");
            const [splDiscriminateInit, splDiscriminateUpdating, splDiscriminateRemove, splDiscriminateUpdate, splDiscriminateEmitter] = [
                "spl_token_metadata_interface:initialize_account",
                "spl_token_metadata_interface:updating_field",
                "spl_token_metadata_interface:remove_key_ix",
                "spl_token_metadata_interface:update_the_authority",
                "spl_token_metadata_interface:emitter",
            ].map((s) => (0, spl_type_length_value_1.splDiscriminate)(s));
            switch (discriminator) {
                case splDiscriminateInit.toString(): {
                    const metadata = token_extensions_1.metadataLayout.decode(instruction.data);
                    parsed = {
                        name: "initializeMetadata",
                        accounts: [
                            { name: "metadata", ...instruction.keys[0] },
                            { name: "updateAuthority", ...instruction.keys[1] },
                            { name: "mint", ...instruction.keys[2] },
                            { name: "mintAuthority", ...instruction.keys[3] },
                        ],
                        args: {
                            name: metadata.name,
                            symbol: metadata.symbol,
                            uri: metadata.uri,
                        },
                    };
                    break;
                }
                case splDiscriminateUpdating.toString(): {
                    const data = token_extensions_1.updateMetadataLayout.decode(instruction.data);
                    parsed = {
                        name: "updateField",
                        accounts: [
                            { name: "metadata", ...instruction.keys[0] },
                            { name: "updateAuthority", ...instruction.keys[1] },
                        ],
                        args: {
                            field: data.field,
                            value: data.value,
                        },
                    };
                    break;
                }
                case splDiscriminateRemove.toString(): {
                    const data = token_extensions_1.removeKeyLayout.decode(instruction.data);
                    parsed = {
                        name: "removeKey",
                        accounts: [
                            { name: "metadata", ...instruction.keys[0] },
                            { name: "updateAuthority", ...instruction.keys[1] },
                        ],
                        args: {
                            idempotent: data.idempotent,
                            value: data.key,
                        },
                    };
                    break;
                }
                case splDiscriminateUpdate.toString(): {
                    const data = token_extensions_1.updateAuthorityLayout.decode(instruction.data);
                    parsed = {
                        name: "updateAuthority",
                        accounts: [
                            { name: "metadata", ...instruction.keys[0] },
                            { name: "oldAuthority", ...instruction.keys[1] },
                        ],
                        args: {
                            newAuthority: new web3_js_1.PublicKey(data.newAuthority),
                        },
                    };
                    break;
                }
                case splDiscriminateEmitter.toString(): {
                    const data = token_extensions_1.emitLayout.decode(instruction.data);
                    parsed = {
                        name: "emit",
                        accounts: [{ name: "metadata", ...instruction.keys[0] }],
                        args: data,
                    };
                    break;
                }
                default:
                    parsed = null;
            }
            break;
        }
    }
    return parsed
        ? { ...parsed, programId: spl_token_1.TOKEN_2022_PROGRAM_ID }
        : { programId: spl_token_1.TOKEN_2022_PROGRAM_ID, name: "unknown", accounts: instruction.keys, args: { unknown: instruction.data } };
}
//# sourceMappingURL=token22.js.map