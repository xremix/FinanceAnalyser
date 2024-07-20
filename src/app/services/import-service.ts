import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { ignoreKeywords } from 'env';
import { DataState } from './data-state';
import { CategoryService } from './category-service';
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

  private parseINGDate(dateString: string): Date {
    const dateParts = dateString.split('.');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const year = parseInt(dateParts[2]);
    return new Date(year, month - 1, day);
  }

  private parseINGLine(columns: string[]): Transaction | undefined {
    let monthAndYear = this.parseINGDate(columns[0]);
    monthAndYear.setDate(1);

    const transaction: Transaction = {
      month: monthAndYear, // Monat
      bookingDate: this.parseINGDate(columns[0]), // Buchung
      valueDate: this.parseINGDate(columns[1]), // Valuta
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

      if (this.isSpkCsv(csvData)) {
        transaction = this.parseSPKLine(columns);
      } else if (this.isIngCsv(csvData)) {
        transaction = this.parseINGLine(columns);
      }

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

  public loadFileFromLocalStorage() {
    this.dataState.resetState();
    const fileContent = localStorage.getItem('fileContent');
    if (!fileContent) {
      console.error('No file content found in local storage');
      return;
    }
    let transactions = this.parseCsvToTransactions(fileContent);
    this.categoryService.fillCategoriesToTransactions(transactions);
    this.dataState.setTransactions(transactions);

    if (transactions.length > 0) {
      this.dataState.resetFilter();
    }
  }

  constructor(private categoryService: CategoryService, private dataState: DataState) {}
}
