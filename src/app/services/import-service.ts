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

  private parseSPKDate(dateString: string): Date {
    // looks like 10.07.24 which is day.month.year
    const dateParts = dateString.split('.');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const year = parseInt(dateParts[2]);
    return new Date(year + 2000, month - 1, day);
  }

  private parseSPKLine(columns: string[]): Transaction | undefined {

    // const bookingColumns = columns[1].split('.').reverse();
    // bookingColumns[0] = '20' + bookingColumns[0];
    // const monthAndYear =  bookingColumns[1] + '-01-' + bookingColumns[2];
    // TODO probably need to fix bookingdate
    let monthAndYear = this.parseSPKDate(columns[1]);
    monthAndYear.setDate(1);
    const transaction: Transaction = {
      month: monthAndYear, // Monat
      bookingDate: this.parseSPKDate(columns[1]), // Buchungsdatum
      valueDate: this.parseSPKDate(columns[2]), // Wertstellung
      payerReceiver: columns[11], // Begünstigter/Zahlungspflichtiger
      bookingText: columns[3], // Buchungstext
      purpose: columns[4], // Verwendungszweck
      balance: 0, // Saldo ist nicht im CSV enthalten, daher 0 als Platzhalter
      balanceCurrency: columns[15], // Währung
      amount: parseFloat(columns[14].replace(',', '.')), // Betrag, entferne Vorzeichen für Konsistent      
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

  private parseINGDate(dateString: string): Date {
    // looks like 10.07.2024 which is day.month.year
    const dateParts = dateString.split('.');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const year = parseInt(dateParts[2]);
    return new Date(year, month - 1, day);
  }

  private parseINGLine(columns: string[]): Transaction | undefined {
    // const bookingColumns = columns[0].split('.');
    // const monthAndYear =  bookingColumns[1] + '-01-' + bookingColumns[2];
    let monthAndYear = this.parseINGDate(columns[0]);
    monthAndYear.setDate(1);

    const transaction: Transaction = {
      month: monthAndYear, // Monat
      bookingDate: this.parseINGDate(columns[0]), // Buchung
      valueDate: this.parseINGDate(columns[1]), // Valuta
      // month: new Date(monthAndYear), // Monat
      // bookingDate: new Date(columns[0].split('.').reverse().join('-')), // buchung
      // valueDate: new Date(columns[1].split('.').reverse().join('-')), // valuta
      payerReceiver: columns[2], // auftraggeberEmpfaenger
      bookingText: columns[3], // buchungstext
      purpose: columns[4], // verwendungszweck
      balance: parseFloat(columns[5].replace(',', '.')), // saldo
      balanceCurrency: columns[6], // saldoWaehrung
      amount: parseFloat(columns[7].replace(',', '.')), // betrag
      amountCurrency: columns[8], // betragWaehrung
    };

    console.log(transaction.bookingDate, transaction.valueDate, transaction.month);
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
