import { sha256 } from "@noble/hashes/sha256";
import { camelCase } from "./camelcase";
function camelToUnderscore(key) {
    const result = key.replace(/([A-Z])/g, " $1");
    return result.split(" ").join("_").toLowerCase();
}
const snakeCase = camelToUnderscore;
function convertLegacyIdl(legacyIdl, programAddress) {
    const address = programAddress ?? legacyIdl.metadata?.address;
    if (!address) {
        throw new Error("Program id missing in `idl.metadata.address` field");
    }
    return {
        accounts: (legacyIdl.accounts || []).map(convertAccount),
        address: address,
        constants: (legacyIdl.constants || []).map(convertConst),
        errors: legacyIdl.errors?.map(convertErrorCode) || [],
        events: legacyIdl.events?.map(convertEvent) || [],
        instructions: legacyIdl.instructions.map(convertInstruction),
        metadata: {
            name: legacyIdl.name,
            version: legacyIdl.version,
            spec: "0.1.0",
        },
        types: [
            ...(legacyIdl.types || []).map(convertTypeDef),
            ...(legacyIdl.accounts || []).map(convertTypeDef),
            ...(legacyIdl.events || []).map(convertEventToTypeDef),
        ],
    };
}
function getDisc(prefix, name) {
    const hash = sha256(`${prefix}:${name}`);
    return Array.from(hash.slice(0, 8));
}
function convertInstruction(instruction) {
    const name = instruction.name;
    return {
        accounts: instruction.accounts.map(convertInstructionAccount),
        args: instruction.args.map(convertField),
        discriminator: getDisc("global", snakeCase(name)),
        name,
        returns: instruction.returns ? convertType(instruction.returns) : undefined,
    };
}
function convertAccount(account) {
    return {
        discriminator: getDisc("account", camelCase(account.name, { preserveConsecutiveUppercase: true, pascalCase: true })),
        name: account.name,
    };
}
function convertTypeDef(typeDef) {
    return {
        name: typeDef.name,
        type: convertTypeDefTy(typeDef.type),
    };
}
function convertTypeDefTy(type) {
    switch (type.kind) {
        case "struct":
            return {
                fields: type.fields.map(convertField),
                kind: "struct",
            };
        case "enum":
            return {
                kind: "enum",
                variants: type.variants.map(convertEnumVariant),
            };
        case "alias":
            return {
                alias: convertType(type.value),
                kind: "type",
            };
    }
}
function convertField(field) {
    return {
        name: field.name,
        type: convertType(field.type),
    };
}
function convertEnumVariant(variant) {
    return {
        fields: variant.fields ? convertEnumFields(variant.fields) : undefined,
        name: variant.name,
    };
}
function convertEnumFields(fields) {
    if (Array.isArray(fields) && fields.length > 0 && typeof fields[0] === "object" && "type" in fields[0]) {
        return fields.map(convertField);
    }
    else {
        return fields.map((type) => convertType(type));
    }
}
function convertEvent(event) {
    return {
        discriminator: getDisc("event", event.name),
        name: event.name,
    };
}
function convertErrorCode(error) {
    return {
        code: error.code,
        msg: error.msg,
        name: error.name,
    };
}
function convertConst(constant) {
    return {
        name: constant.name,
        type: convertType(constant.type),
        value: constant.value,
    };
}
function convertInstructionAccount(account) {
    if ("accounts" in account) {
        return convertInstructionAccounts(account);
    }
    else {
        return {
            docs: account.docs || [],
            name: account.name,
            optional: account.isOptional || false,
            pda: account.pda ? convertPda(account.pda) : undefined,
            relations: account.relations || [],
            signer: account.isSigner || false,
            writable: account.isMut || false,
        };
    }
}
function convertInstructionAccounts(accounts) {
    return {
        accounts: accounts.accounts.map(convertInstructionAccount),
        name: accounts.name,
    };
}
function convertPda(pda) {
    return {
        programId: pda.programId ? convertSeed(pda.programId) : undefined,
        seeds: pda.seeds.map(convertSeed),
    };
}
function convertSeed(seed) {
    switch (seed.kind) {
        case "const":
            return { kind: "const", type: convertType(seed.type), value: seed.value };
        case "arg":
            return { kind: "arg", path: seed.path, type: convertType(seed.type) };
        case "account":
            return {
                account: seed.account,
                kind: "account",
                path: seed.path,
                type: convertType(seed.type),
            };
    }
}
function convertEventToTypeDef(event) {
    return {
        name: event.name,
        type: {
            fields: event.fields.map((field) => ({
                name: field.name,
                type: convertType(field.type),
            })),
            kind: "struct",
        },
    };
}
function convertType(type) {
    if (typeof type === "string") {
        return type === "publicKey" ? "pubkey" : type;
    }
    else if ("vec" in type) {
        return { vec: convertType(type.vec) };
    }
    else if ("option" in type) {
        return { option: convertType(type.option) };
    }
    else if ("defined" in type) {
        return { defined: { generics: [], name: type.defined } };
    }
    else if ("array" in type) {
        return { array: [convertType(type.array[0]), type.array[1]] };
    }
    else if ("generic" in type) {
        return type;
    }
    else if ("definedWithTypeArgs" in type) {
        return {
            defined: {
                generics: type.definedWithTypeArgs.args.map(convertDefinedTypeArg),
                name: type.definedWithTypeArgs.name,
            },
        };
    }
    throw new Error(`Unsupported type: ${JSON.stringify(type)}`);
}
function convertDefinedTypeArg(arg) {
    if ("generic" in arg) {
        return { generic: arg.generic };
    }
    else if ("value" in arg) {
        return { value: arg.value };
    }
    else if ("type" in arg) {
        return { type: convertType(arg.type) };
    }
    throw new Error(`Unsupported defined type arg: ${JSON.stringify(arg)}`);
}
export function convertLegacyIdlToV30(idl, programAddress) {
    const spec = idl.metadata?.spec;
    if (spec) {
        switch (spec) {
            case "0.1.0":
                return idl;
            default:
                throw new Error(`IDL spec not supported: ${spec ?? ""}`);
        }
    }
    else {
        const formattedIdl = convertLegacyIdl(idl, programAddress);
        return formattedIdl;
    }
}
//# sourceMappingURL=legacy.idl.converter.js.map