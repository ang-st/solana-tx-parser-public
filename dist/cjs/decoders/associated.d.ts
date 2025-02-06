import { TransactionInstruction } from "@solana/web3.js";
import { ParsedInstruction } from "../interfaces";
import { AssociatedTokenProgramIdl } from "../programs";
declare function decodeAssociatedTokenInstruction(instruction: TransactionInstruction): ParsedInstruction<AssociatedTokenProgramIdl>;
export { decodeAssociatedTokenInstruction };
//# sourceMappingURL=associated.d.ts.map