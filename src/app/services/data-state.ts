import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { Category } from '../models/category';
@Injectable({
  providedIn: 'root',
})
export class DataState {
  public transactions: Transaction[] = [];
  public selectedTransactions: Transaction[] = [];

  // default is first day of current month
  private selectedMonth: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  private refreshSelecatedTransactions(){
    this.selectedTransactions = this.transactions.filter(
      (t) =>
        t.valueDate.getFullYear() === this.selectedMonth.getFullYear() &&
        t.valueDate.getMonth() === this.selectedMonth.getMonth()
    );
  }
  setSelectedMonth(month: Date) {
    this.selectedMonth = month;
    this.refreshSelecatedTransactions();
  }
}
