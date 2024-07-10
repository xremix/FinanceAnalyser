import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
@Injectable({
  providedIn: 'root',
})
export class ImportService {

    public async getFileContent(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          resolve(fileReader.result as string);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
        fileReader.readAsText(file);
      });
    }


  public parseCsvToTransactions(csvData: string): Transaction[] {
    const lines = csvData.split('\n');
    const transactions: Transaction[] = [];
    // Überspringe die Kopfzeile
    for (let i = 1; i < lines.length; i++) {

      const line = lines[i];
      if (line.trim() === '') continue; // Überspringe leere Zeilen
      const columns = line.split(';');
      if(columns.length < 9) continue; // Überspringe Zeilen mit zu wenig Spalten
      console.log(columns)
      const transaction: Transaction = {
        bookingDate: new Date(columns[0].split('.').reverse().join('-')), // buchung
        valueDate: new Date(columns[1].split('.').reverse().join('-')), // valuta
        payerReceiver: columns[2], // auftraggeberEmpfaenger
        bookingText: columns[3], // buchungstext
        purpose: columns[4], // verwendungszweck
        balance: parseFloat(columns[5].replace(',', '.')), // saldo
        balanceCurrency: columns[6], // saldoWaehrung
        amount: parseFloat(columns[7].replace(',', '.')), // betrag
        amountCurrency: columns[8], // betragWaehrung
      };
      transactions.push(transaction);
    }
    return transactions;
  }
}
