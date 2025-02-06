import { TransactionInstruction } from "@solana/web3.js";
import { ParsedInstruction } from "../interfaces";
import { SplTokenIdl } from "../programs";
declare function decodeTokenInstruction(instruction: TransactionInstruction): ParsedInstruction<SplTokenIdl>;
export { decodeTokenInstruction };
//# sourceMappingURL=token.d.ts.map