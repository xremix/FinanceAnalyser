import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { Importer } from './importer';


@Injectable({
  providedIn: 'root',
})
export class SpkImporter implements Importer {
  private ignoreKeywords: string[] = ['UEBERTRAG (', 'Auftragskonto', 'Buchung;Valuta'];
    public canParseCSV(csvData: string): boolean {
      return csvData.toLowerCase().startsWith(`"Auftragskonto";"`.toLowerCase());
    }

  private parseDate(dateString: string): Date {
    // looks like 10.07.24 which is day.month.year
    const dateParts = dateString.split('.');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const year = parseInt(dateParts[2]);
    return new Date(year + 2000, month - 1, day);
  }

  private parseLine(columns: string[]): Transaction | undefined {
    let monthAndYear = this.parseDate(columns[1]);
    monthAndYear.setDate(1);
    const transaction: Transaction = {
      month: monthAndYear, // Monat
      bookingDate: this.parseDate(columns[1]), // Buchungsdatum
      valueDate: this.parseDate(columns[2]), // Wertstellung
      payerReceiver: columns[11], // Begünstigter/Zahlungspflichtiger
      bookingText: columns[3], // Buchungstext
      purpose: columns[4], // Verwendungszweck
      balance: 0, // Saldo ist nicht im CSV enthalten, daher 0 als Platzhalter
      balanceCurrency: columns[15], // Währung
      amount: parseFloat(columns[14].replace(',', '.')), // Betrag, entferne Vorzeichen für Konsistent
      amountCurrency: columns[15], // Währung
      raw: columns.join(';'),
    };

    if (transaction.bookingDate.getFullYear() < 2000) {
      transaction.bookingDate.setFullYear(transaction.bookingDate.getFullYear() + 2000);
    }
    if (transaction.valueDate.getFullYear() < 2000) {
      transaction.valueDate.setFullYear(transaction.valueDate.getFullYear() + 2000);
    }

    return transaction;
  }

  public parseCsvToTransactions(csvData: string): Transaction[] {
    const lines = csvData.split('\n');
    const transactions: Transaction[] = [];

    // Überspringe die Kopfzeile
    for (let i = 1; i < lines.length; i++) {
      let line = lines[i];

      //ignoreKeywords
      if (this.ignoreKeywords.some((keyword) => line.toLowerCase().includes(keyword.toLowerCase()))) {
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
