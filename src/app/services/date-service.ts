import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { Category } from '../models/category';
import { CategorySummary } from '../models/category-summary';
import { availableCategories, defaultCategory } from '../../../env';
@Injectable({
  providedIn: 'root',
})
export class DateService {
  public firstDate(transactions: Transaction[]): Date | null {
      if (transactions.length === 0) return null;
      return transactions.reduce((acc, t) => (t.valueDate < acc ? t.valueDate : acc), transactions[0].valueDate);
    }
    public lastDate(transactions: Transaction[]): Date | null {
      if (transactions.length === 0) return null;
      return transactions.reduce((acc, t) => (t.valueDate > acc ? t.valueDate : acc), transactions[0].valueDate);
    }
  public getMonths(transactions: Transaction[]): Date[] {
      if (transactions.length === 0) return [];
      const first = this.firstDate(transactions);
      const last = this.lastDate(transactions);
      if (!first || !last) return [];
      const months: Date[] = [];
      let current = new Date(first);
      while (current <= last) {
        months.push(new Date(current));
        current.setMonth(current.getMonth() + 1);
      }
      return months;
    }
}