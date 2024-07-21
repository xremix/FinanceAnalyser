import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { ignoreKeywords } from 'env';
import { Importer } from './importer';


@Injectable({
  providedIn: 'root',
})
export class IngImporter implements Importer {
    public canParseCSV(csvData: string): boolean {
        return csvData.toLowerCase().startsWith(`Umsatzanzeige;Datei`.toLowerCase());
    }

  private parseDate(dateString: string): Date {
    const dateParts = dateString.split('.');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const year = parseInt(dateParts[2]);
    return new Date(year, month - 1, day);
  }

  private parseLine(columns: string[]): Transaction | undefined {
    let monthAndYear = this.parseDate(columns[0]);
    monthAndYear.setDate(1);

    const transaction: Transaction = {
      month: monthAndYear, // Monat
      bookingDate: this.parseDate(columns[0]), // Buchung
      valueDate: this.parseDate(columns[1]), // Valuta
      payerReceiver: columns[2], // auftraggeberEmpfaenger
      bookingText: columns[3], // buchungstext
      purpose: columns[4], // verwendungszweck
      balance: parseFloat(columns[5].replace('.', '').replace(',', '.')), // saldo
      balanceCurrency: columns[6], // saldoWaehrung
      amount: parseFloat(columns[7].replace('.', '').replace(',', '.')), // betrag
      amountCurrency: columns[8], // betragWaehrung
      raw: columns.join(';'),
    };

    return transaction;
  }

  public parseCsvToTransactions(csvData: string): Transaction[] {
    const lines = csvData.split('\n');
    const transactions: Transaction[] = [];

    // Überspringe die Kopfzeile
    for (let i = 1; i < lines.length; i++) {
      let line = lines[i];

      //ignoreKeywords
      if (ignoreKeywords.some((keyword) => line.toLowerCase().includes(keyword.toLowerCase()))) {
        console.warn('Ignoring line because of keyword:', line);
        continue;
      }

      if (line.trim() === '') continue; // Überspringe leere Zeilen
      const columns = line.split(';');
      if (columns.length < 9) continue; // Überspringe Zeilen mit zu wenig Spalten
      
      // remove " from the columns
      columns.forEach((column, index) => {
        columns[index] = column.replace(/"/g, '');
      });

      let transaction: Transaction | undefined;
        transaction = this.parseLine(columns);

      if (transaction) {
        transactions.push(transaction);
      }
    }
    return transactions;
  }
}
