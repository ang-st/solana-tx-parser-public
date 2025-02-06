import { AccountMeta, CompiledInstruction, LoadedAddresses, Message, MessageCompiledInstruction, PartiallyDecodedInstruction, TransactionInstruction, VersionedMessage, VersionedTransactionResponse } from "@solana/web3.js";
import { ProgramLogContext } from "./interfaces";
export declare function hexToBuffer(data: string): Buffer;
/**
 * Parse transaction message and extract account metas
 * @param message transaction message
 * @returns parsed accounts metas
 */
export declare function parseTransactionAccounts<T extends Message | VersionedMessage>(message: T, loadedAddresses?: T extends VersionedMessage ? LoadedAddresses | undefined : undefined): AccountMeta[];
/**
 * Converts compiled instruction into common TransactionInstruction
 * @param compiledInstruction
 * @param parsedAccounts account meta, result of {@link parseTransactionAccounts}
 * @returns TransactionInstruction
 */
export declare function compiledInstructionToInstruction<Ix extends CompiledInstruction | MessageCompiledInstruction>(compiledInstruction: Ix, parsedAccounts: AccountMeta[]): TransactionInstruction;
export declare function parsedInstructionToInstruction(parsedInstruction: PartiallyDecodedInstruction, accountMeta: AccountMeta[]): TransactionInstruction;
/**
 * Converts transaction response with CPI into artifical transaction that contains all instructions from tx and CPI
 * @param transaction transactionResponse to convert from
 * @returns Transaction object
 */
export declare function flattenTransactionResponse(transaction: VersionedTransactionResponse): TransactionInstruction[];
/**
 * Parses transaction logs and provides additional context such as
 * - programId that generated the message
 * - call id of instruction, that generated the message
 * - call depth of instruction
 * - data messages, log messages and error messages
 * @param logs logs from TransactionResponse.meta.logs
 * @returns parsed logs with call depth and additional context
 */
export declare function parseLogs(logs: string[]): ProgramLogContext[];
/** Python script to extract native solana logs
 *
 # coding=utf8
# the above tag defines encoding for this document and is for Python 2.x compatibility

import re
import os

regex = r"ic_msg!\((\s|.)*?,\s*?\"(?P<log>.*?)\""

def print_logs(data):
    matches = re.finditer(regex, data)
    for m in matches:
        print(m.group('log'))

def open_files_in_directory(directory):
    for root, dirs, files in os.walk(directory):
        for filename in files:
            if '.rs' not in filename:
                continue
            file_path = os.path.join(root, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    print(f'Opened file: {file_path}')
                    content = file.read()
                    print_logs(content)
            except Exception as e:
                print(f'Could not open file {file_path}: {e}')
        for d in dirs:
            if d == '.' or d == '..':
                continue
            open_files_in_directory(os.path.join(root, d))

if __name__ == "__main__":
    open_files_in_directory('INPUT DIR HERE')

 */
//# sourceMappingURL=helpers.d.ts.map