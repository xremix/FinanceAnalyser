import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { Category } from '../models/category';
@Injectable({
  providedIn: 'root',
})
export class DataState {
  public transactions: Transaction[] = [];

  // default is first day of current month
  public selectedMonth: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  public get selectedTransactions(): Transaction[] {
    return this.transactions.filter(
      (t) =>
        t.valueDate.getFullYear() === this.selectedMonth.getFullYear() &&
        t.valueDate.getMonth() === this.selectedMonth.getMonth()
    );
  }
}
