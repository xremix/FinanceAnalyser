import { ChangeDetectorRef, EventEmitter, Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { DateService } from './date-service';
import { Category  } from '../models/category';

import { DuplicateService } from './duplicate-service';

export interface DateFilter {
  from: Date;
  to: Date;
  name: string;
}

export interface DataFilter {
  from: Date;
  to: Date;
  category: Category | undefined;
  type: 'all' | 'income' | 'expense';
}

@Injectable({
  providedIn: 'root',
})
export class DataState {
  private _transactions: Transaction[] = [];
  public duplicates: Transaction[] = [];

  public months: DateFilter[] = [];
  public monthStarts: Date[] = [];
  public categories: Category[] = [];

  constructor(private dateService: DateService, private duplicateService: DuplicateService) {}

  get hasLoadedData(): boolean {
    return this._transactions.length > 0;
  }

  private get transactions(): Transaction[] {
    return this._transactions;
  }

  public setTransactions(value: Transaction[]): void {
    this._transactions = value;
    this.months = this.dateService.getMonths(this._transactions);
    this.monthStarts = this.months.map((m) => m.from);
    this.findDuplicates();
  }
  private findDuplicates(){
    this.duplicates = this.duplicateService.findDuplicateTransactions(this.selectedTransactions);
  }

  // event emitter when selected transactions change
  public selectedTransactionsChanged: EventEmitter<Transaction[]> = new EventEmitter();
  public selectedTransactions: Transaction[] = [];
  public currentFilter: DataFilter = {
    from: new Date(0),
    to: new Date(),
    category: undefined as Category | undefined,
    type: 'all',
  };

  get selectedMonthAmountInDataRangeFilter(): number {
    var startDate = new Date(this.currentFilter.from);
    var endDate = new Date(this.currentFilter.to);
    var amountMonths =
      endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear());

    return amountMonths + 1; // Include both start and end month in the count
  }

  public showTransaction(transaction: Transaction): boolean {
    const isBookingDateInFilter =
      transaction.bookingDate >= this.currentFilter.from && transaction.bookingDate <= this.currentFilter.to;
    const isCategoryInFilter =
      this.currentFilter.category === undefined ||
      transaction.category === this.currentFilter.category ||
      this.currentFilter.category.subCategories?.some((subCat) => transaction.category === subCat);
    const isTypeInFilter =
      this.currentFilter.type === 'all' ||
      (this.currentFilter.type === 'expense' && transaction.amount < 0) ||
      (this.currentFilter.type === 'income' && transaction.amount > 0);
    return isBookingDateInFilter && isCategoryInFilter && isTypeInFilter;
  }

  private refresh() {
    this.selectedTransactions = this.transactions.filter((t) => this.showTransaction(t));
    this.findDuplicates();
    this.selectedTransactionsChanged.emit(this.selectedTransactions);
  }

  filterByRange(from: Date, to: Date) {
    this.currentFilter.from = from;
    this.currentFilter.to = to;
    this.refresh();
  }

  filterByDateFilter(dateFilter: DateFilter) {
    // Check if the selected month is already the current filter
    if (
      this.currentFilter.from.getTime() === dateFilter.from.getTime() &&
      this.currentFilter.to.getTime() === dateFilter.to.getTime()
    ) {
      // Reset the filter if the same month is selected again
      this.resetMonth();
    } else {
      // Set the filter to the selected month
      this.currentFilter.from = dateFilter.from;
      this.currentFilter.to = dateFilter.to;
    }
    this.refresh();
  }
  filterByDay(date: Date) {
    let firstOfMonth = new Date(date);
    firstOfMonth.setDate(1);
    let lastOfMonth = new Date(firstOfMonth);
    lastOfMonth.setMonth(lastOfMonth.getMonth() + 1);
    lastOfMonth.setDate(-1);
    this.filterByDateFilter({ from: firstOfMonth, to: lastOfMonth, name: date.toLocaleDateString() });
  }

  filterByCategory(category: Category) {
    if (this.currentFilter.category === category) {
      this.currentFilter.category = undefined;
    } else {
      this.currentFilter.category = category;
    }
    this.refresh();
  }

  resetMonth() {
    const transactionsWithDate = this._transactions.filter((t) => t.bookingDate);
    if (transactionsWithDate.length > 0) {
      this.currentFilter.to = transactionsWithDate[0].bookingDate;
      this.currentFilter.from = transactionsWithDate[transactionsWithDate.length - 1].bookingDate;
      this.refresh();
    }
  }
  resetFilter() {
    this.resetMonth();
    this.resetCategory();
  }
  resetCategory() {
    this.currentFilter.category = undefined;
    this.refresh();
  }
  resetState() {
    this._transactions = [];
    this.selectedTransactions = [];
    this.months = [];
    this.resetCategories();
  }

  private resetCategories() {
    // TODO Reset the amount and transactions
    // for each category clean the total and transactions
    this.categories.forEach((c) => {
      c.total = 0;
      c.transactions = [];
      c.subCategories?.forEach((subCat) => {
        subCat.total = 0;
        subCat.transactions = [];
      });
    });
  }

  filterByType(type: 'all' | 'income' | 'expense') {
    this.currentFilter.type = type;
    this.refresh();
  }


}
