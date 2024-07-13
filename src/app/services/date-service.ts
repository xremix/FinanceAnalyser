import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  public firstDate(transactions: Transaction[]): Date | null {
      if (transactions.length === 0) return null;
      return transactions.reduce((acc, t) => (t.bookingDate < acc ? t.bookingDate : acc), transactions[0].bookingDate);
    }
    public lastDate(transactions: Transaction[]): Date | null {
      if (transactions.length === 0) return null;
      return transactions.reduce((acc, t) => (t.bookingDate > acc ? t.bookingDate : acc), transactions[0].bookingDate);
    }
  public getMonths(transactions: Transaction[]): Date[] {
      if (transactions.length === 0) return [];
      const first = this.firstDate(transactions);
      const last = this.lastDate(transactions);
      if (!first || !last) return [];
      const months: Date[] = [];
      let current = new Date(first);
      current.setDate(1);
      while (current <= last) {
        months.push(new Date(current));
        current.setMonth(current.getMonth() + 1);
      }
      return months;
    }
}
