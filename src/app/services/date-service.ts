import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { DateFilter } from './data-state';

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
  public getMonths(transactions: Transaction[]): DateFilter[] {
      if (transactions.length === 0) return [];
      const first = this.firstDate(transactions);
      const last = this.lastDate(transactions);
      if (!first || !last) return [];
      
      const months: DateFilter[] = [];
      let current = new Date(first); // Annahme: 'first' ist bereits definiert
      current.setDate(1);
      
      while (current <= last) { // Annahme: 'last' ist bereits definiert
        const monthStart = new Date(current);
        const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0); // Letzter Tag des Monats
      
        const month: DateFilter = {
          from: monthStart,
          to: monthEnd,
          name: monthStart.toLocaleString('default', { month: 'long' }) + ' ' + monthStart.getFullYear(),
        };
      
        months.push(month);
      
        current.setMonth(current.getMonth() + 1);
      }
      return months;
    }
}
