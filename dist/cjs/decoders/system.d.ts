import { TransactionInstruction } from "@solana/web3.js";
import { ParsedInstruction } from "../interfaces";
import { SystemProgramIdl } from "../programs";
declare function decodeSystemInstruction(instruction: TransactionInstruction): ParsedInstruction<SystemProgramIdl>;
export { decodeSystemInstruction };
//# sourceMappingURL=system.d.ts.map