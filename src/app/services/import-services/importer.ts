import { Transaction } from "src/app/models/transaction";
import { BalanceAnchor } from "src/app/models/balance";

export interface Importer
{
    canParseCSV(csvData: string): boolean;
    parseCsvToTransactions(csvData: string): Transaction[];
    /** Optional: account balance contained in the file (e.g. ING header "Saldo") */
    parseBalance?(csvData: string): BalanceAnchor | undefined;
}
