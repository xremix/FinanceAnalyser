import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { Importer } from './importer';

/**
 * CSV-CAMT v2 (DFÜ-Abwicklung) Format Parser for Sparkasse (SPK)
 * Supports the standardized German banking CSV format as per ISO 20022
 * 
 * CSV-CAMT v2 Standard Fields (Header Row):
 * - Auftragskonto: Account number
 * - Buchung: Booking date
 * - Valuta: Value date
 * - Buchungstext: Transaction type/text
 * - Verwendungszweck: Purpose/reference
 * - Begünstigter/Zahlungspflichtiger: Payer/payee name
 * - Betrag: Amount (with decimal separator)
 * - Währung: Currency code (ISO 4217)
 */

@Injectable({
  providedIn: 'root',
})
export class SpkImporter implements Importer {
  // CSV-CAMT v2 Standard Headers
  // Note: Some banks use ASCII-safe variants (ü->ue, ä->ae) for encoding compatibility
  private readonly CAMT_V2_HEADERS = {
    ACCOUNT: 'Auftragskonto',
    BOOKING_DATE: ['Buchungstag', 'Buchung'], // Variant names
    VALUE_DATE: ['Valutadatum', 'Valuta'],
    BOOKING_TEXT: 'Buchungstext',
    PURPOSE: 'Verwendungszweck',
    PAYER_RECEIVER: ['Beguenstigter/Zahlungspflichtiger', 'Begünstigter/Zahlungspflichtiger'],
    AMOUNT: 'Betrag',
    CURRENCY: ['Waehrung', 'Währung'],
  };

  private ignoreKeywords: string[] = ['UEBERTRAG ('];
  private columnMap: Map<string, number> = new Map();

  public canParseCSV(csvData: string): boolean {
    const headerLine = csvData.split('\n')[0];
    return headerLine?.toLowerCase().includes('Auftragskonto'.toLowerCase());
  }

  /**
   * Parses date in DD.MM.YY format (CAMT v2 standard for German banks)
   * Handles both 2-digit and 4-digit years correctly
   */
  private parseDate(dateString: string): Date {
    if (!dateString || dateString.trim() === '') {
      return new Date(NaN);
    }

    const dateParts = dateString.trim().split('.');
    if (dateParts.length !== 3) {
      console.warn(`Invalid date format: "${dateString}". Expected DD.MM.YY`);
      return new Date(NaN);
    }

    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    let year = parseInt(dateParts[2], 10);

    // Handle 2-digit year (CAMT v2 standard)
    if (year < 100) {
      year += year < 30 ? 2000 : 1900;
    }

    // Validate date components
    if (day < 1 || day > 31 || month < 1 || month > 12) {
      console.warn(`Invalid date components: day=${day}, month=${month}, year=${year}`);
      return new Date(NaN);
    }

    return new Date(year, month - 1, day);
  }

  /**
   * Parses amount according to CAMT v2 standard
   * Handles German decimal separator (,) and optional currency sign
   */
  private parseAmount(amountString: string): number {
    if (!amountString || amountString.trim() === '') {
      console.warn('Empty amount string');
      return 0;
    }

    // Remove spaces and common currency symbols
    let cleanAmount = amountString.trim().replace(/[\s€$]/g, '');
    // Replace German decimal separator
    cleanAmount = cleanAmount.replace(',', '.');

    const amount = parseFloat(cleanAmount);
    if (isNaN(amount)) {
      console.warn(`Failed to parse amount: "${amountString}"`);
      return 0;
    }

    return amount;
  }

  /**
   * Extracts column positions from header row
   * Validates against CAMT v2 standard requirements
   * Supports variant header names (e.g., with/without umlauts)
   */
  private mapHeaderToColumns(headerLine: string): boolean {
    const headers = this.cleanColumns(headerLine.split(';'));
    this.columnMap.clear();

    // Map required CAMT v2 fields
    for (const [fieldName, headerValue] of Object.entries(this.CAMT_V2_HEADERS)) {
      const variants = Array.isArray(headerValue) ? headerValue : [headerValue];
      const columnIndex = headers.findIndex((header) =>
        variants.some((variant) => header === variant)
      );

      if (columnIndex === -1) {
        console.warn(`Required CAMT v2 field not found: ${fieldName}. Tried variants:`, variants);
        console.info('Found headers:', headers);
        return false;
      }
      this.columnMap.set(fieldName, columnIndex);
    }

    console.debug('Successfully mapped CAMT v2 headers:', Object.fromEntries(this.columnMap));
    return true;
  }

  /**
   * Removes quotes and whitespace from CSV columns
   */
  private cleanColumns(columns: string[]): string[] {
    return columns.map((col) => col.replace(/^"|"$/g, '').trim());
  }

  /**
   * Validates that a transaction line has enough columns for CAMT v2 parsing
   */
  private isValidCamtv2Line(columns: string[]): boolean {
    const requiredColumnCount = Math.max(...Array.from(this.columnMap.values())) + 1;
    return columns.length >= requiredColumnCount;
  }

  /**
   * Parses a single line into a Transaction object
   * Follows CAMT v2 field mapping and validation rules
   */
  private parseLine(columns: string[]): Transaction | undefined {
    if (!this.isValidCamtv2Line(columns)) {
      console.warn('Line does not contain required CAMT v2 columns:', columns);
      return undefined;
    }

    // Validate against ignore keywords (e.g., summary lines)
    if (this.ignoreKeywords.some((keyword) =>
        columns.join(';').toLowerCase().includes(keyword.toLowerCase())
    )) {
      return undefined;
    }

    const cleanCols = this.cleanColumns(columns);

    const bookingDate = this.parseDate(cleanCols[this.columnMap.get('BOOKING_DATE')!]);
    const valueDate = this.parseDate(cleanCols[this.columnMap.get('VALUE_DATE')!]);

    // Skip invalid transactions
    if (bookingDate.toString() === 'Invalid Date' && valueDate.toString() === 'Invalid Date') {
      console.warn('Transaction has invalid dates, skipping:', cleanCols);
      return undefined;
    }

    // Determine month (use booking date, fallback to value date)
    const effectiveDate = bookingDate.toString() !== 'Invalid Date' ? bookingDate : valueDate;
    const monthAndYear = new Date(effectiveDate);
    monthAndYear.setDate(1);

    const transaction: Transaction = {
      month: monthAndYear,
      bookingDate,
      valueDate,
      payerReceiver: cleanCols[this.columnMap.get('PAYER_RECEIVER')!],
      bookingText: cleanCols[this.columnMap.get('BOOKING_TEXT')!],
      purpose: cleanCols[this.columnMap.get('PURPOSE')!],
      balance: 0, // Not provided in CAMT v2 standard CSV export
      balanceCurrency: cleanCols[this.columnMap.get('CURRENCY')!],
      amount: this.parseAmount(cleanCols[this.columnMap.get('AMOUNT')!]),
      amountCurrency: cleanCols[this.columnMap.get('CURRENCY')!],
      raw: columns.join(';'),
    };

    return transaction;
  }

  public parseCsvToTransactions(csvData: string): Transaction[] {
    const lines = csvData.split('\n');
    if (lines.length < 2) {
      console.error('CSV contains no data lines');
      return [];
    }

    const transactions: Transaction[] = [];

    // Parse header (line 0)
    if (!this.mapHeaderToColumns(lines[0])) {
      console.error('Failed to parse CAMT v2 headers. Expected fields:', Object.values(this.CAMT_V2_HEADERS));
      return [];
    }

    // Parse data lines (starting from line 1)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim() === '') {
        continue; // Skip empty lines
      }

      const columns = line.split(';');
      const transaction = this.parseLine(columns);

      if (transaction) {
        transactions.push(transaction);
      }
    }

    console.info(`Successfully parsed ${transactions.length} transactions from CAMT v2 CSV`);
    return transactions;
  }
}
