import { Transaction } from "src/app/models/transaction";

export interface Importer
{
    canParseCSV(csvData: string): boolean;
    parseCsvToTransactions(csvData: string): Transaction[];
}
