import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { Importer } from './importer';


@Injectable({
  providedIn: 'root',
})
export class IngImporter implements Importer {
  private ignoreKeywords: string[] = ['UEBERTRAG (', 'Auftragskonto', 'Buchung;Valuta'];

    public canParseCSV(csvData: string): boolean {
        return csvData.toLowerCase().startsWith(`Umsatzanzeige;Datei`.toLowerCase());
    }

  private parseDate(dateString: string): Date {
    if (!dateString || dateString.trim() === '') {
      return new Date(NaN);
    }

    const dateParts = dateString.trim().split('.');
    if (dateParts.length !== 3) {
      return new Date(NaN);
    }

    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    let year = parseInt(dateParts[2], 10);

    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
      return new Date(NaN);
    }

    // Support two-digit years in exports.
    if (year < 100) {
      year += year < 30 ? 2000 : 1900;
    }

    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return new Date(NaN);
    }

    const parsedDate = new Date(year, month - 1, day);
    if (
      parsedDate.getFullYear() !== year ||
      parsedDate.getMonth() !== month - 1 ||
      parsedDate.getDate() !== day
    ) {
      return new Date(NaN);
    }

    return parsedDate;
  }

  private isValidDate(date: Date): boolean {
    return date instanceof Date && !Number.isNaN(date.getTime());
  }

  private parseLine(columns: string[]): Transaction | undefined {
    const bookingDate = this.parseDate(columns[0]);
    const valueDate = this.parseDate(columns[1]);
    const hasValidBookingDate = this.isValidDate(bookingDate);
    const hasValidValueDate = this.isValidDate(valueDate);

    if (!hasValidBookingDate && !hasValidValueDate) {
      console.warn('Invalid transaction date:', columns);
      return undefined;
    }

    const safeBookingDate = hasValidBookingDate ? bookingDate : valueDate;
    const safeValueDate = hasValidValueDate ? valueDate : safeBookingDate;

    let monthAndYear = new Date(safeBookingDate);
    monthAndYear.setDate(1);

    const transaction: Transaction = {
      month: monthAndYear, // Monat
      bookingDate: safeBookingDate, // Buchung
      valueDate: safeValueDate, // Valuta
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
