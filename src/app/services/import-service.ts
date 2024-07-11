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

  private parseSPKLine(columns: string[]): Transaction | undefined {
    const transaction: Transaction = {
      bookingDate: new Date(columns[1].split('.').join('-')), // Buchungstag
      valueDate: new Date(columns[2].split('.').join('-')), // Valutadatum
      payerReceiver: columns[11], // Begünstigter/Zahlungspflichtiger
      bookingText: columns[3], // Buchungstext
      purpose: columns[4], // Verwendungszweck
      balance: 0, // Saldo ist nicht im CSV enthalten, daher 0 als Platzhalter
      balanceCurrency: columns[15], // Währung
      amount: parseFloat(columns[14].replace(',', '.')), // Betrag, entferne Vorzeichen für Konsistenz
      amountCurrency: columns[15], // Währung
    };
    if (transaction.bookingDate.getFullYear() < 2000) {
      transaction.bookingDate.setFullYear(transaction.bookingDate.getFullYear() + 2000);
    }
    if (transaction.valueDate.getFullYear() < 2000) {
      transaction.valueDate.setFullYear(transaction.valueDate.getFullYear() + 2000);
    }


    return transaction;
  }

  private parseINGLine(columns: string[]): Transaction | undefined {
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
    return transaction;
  }

  private containsAnyKeyword(column: string, keywords: string[]): boolean {
    return keywords.some((keyword) => column.toLowerCase().includes(keyword.toLowerCase()));
  }

  public parseCsvToTransactions(csvData: string): Transaction[] {
    const lines = csvData.split('\n');
    const transactions: Transaction[] = [];

    // Überspringe die Kopfzeile
    for (let i = 1; i < lines.length; i++) {
      let line = lines[i];

      if (line.trim() === '') continue; // Überspringe leere Zeilen
      const columns = line.split(';');
      if (columns.length < 9) continue; // Überspringe Zeilen mit zu wenig Spalten
      // remove " from the columns
        columns.forEach((column, index) => {
            columns[index] = column.replace(/"/g, '');
        });
      const keywords = ['Auftragskonto', 'Buchung'];
      if (this.containsAnyKeyword(columns[0], keywords)) {
        continue;
      }
      let transaction: Transaction | undefined;

      if (this.isSpkCsv(csvData)) {
        transaction = this.parseSPKLine(columns);
      } else if (this.isIngCsv(csvData)) {
        transaction = this.parseINGLine(columns);
      }
      //= this.isIngCsv(csvData) ? this.parseINGLine(columns) : this.parseSPKLine(columns);
      if (transaction) {
        transactions.push(transaction);
      }
    }
    return transactions;
  }

  private isIngCsv(csvData: string): boolean {
    return csvData.toLowerCase().startsWith(`Umsatzanzeige;Datei`.toLowerCase());
  }

  private isSpkCsv(csvData: string): boolean {
    return csvData.toLowerCase().startsWith(`"Auftragskonto";"`.toLowerCase());
  }
}
