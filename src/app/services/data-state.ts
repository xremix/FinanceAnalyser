import { EventEmitter, Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { DateService } from './date-service';
import { CategoryService } from './category-service';
import { Category } from '../models/category';
import { availableCategories } from 'env';

export interface DateFilter {
  from: Date;
  to: Date;
  name: string;
}
@Injectable({
  providedIn: 'root',
})
export class DataState {
  private _transactions: Transaction[] = [];

  public months: DateFilter[] = [];
  public monthStarts: Date[] = [];
  public categories: Category[] = availableCategories;

  constructor(private dateService: DateService) {}

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
  }

  // event emitter when selected transactions change
  public selectedTransactionsChanged: EventEmitter<Transaction[]> = new EventEmitter();
  public selectedTransactions: Transaction[] = [];
  public currentFilter = {
    from: new Date(0),
    to: new Date(),
    category: undefined as Category | undefined,
  };

  get selectedMonthAmountInDataRangeFilter(): number {
    var startDate = new Date(this.currentFilter.from);
    var endDate = new Date(this.currentFilter.to);
    var amountMonths =
      endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear());

    return amountMonths + 1; // Include both start and end month in the count
  }

  public showTransaction(transaction: Transaction): boolean{
    // this.selectedTransactions = this.transactions.filter(
    //   (t) => t.bookingDate >= this.currentFilter.from && t.bookingDate <= this.currentFilter.to
    // );
    // this.selectedTransactions = this.selectedTransactions.filter(
    //   (t) =>
    //     this.currentFilter.category === undefined ||
    //     t.category === this.currentFilter.category ||
    //     this.currentFilter.category.subCategories?.some((subCat) => t.category === subCat)
    // );
    const isBookingDateInFilter = transaction.bookingDate >= this.currentFilter.from && transaction.bookingDate <= this.currentFilter.to;
    const isCategoryInFilter = this.currentFilter.category === undefined ||
      transaction.category === this.currentFilter.category ||
      this.currentFilter.category.subCategories?.some((subCat) => transaction.category === subCat);
    return isBookingDateInFilter && isCategoryInFilter; 
  }

  public refresh() {
    this.selectedTransactions = this.transactions.filter(t => this.showTransaction(t));
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
  filterByCategory(category: Category) {
    if (this.currentFilter.category === category) {
      this.currentFilter.category = undefined;
    } else {
      this.currentFilter.category = category;
    }
    this.refresh();
  }

  resetMonth() {
    if (this._transactions.length > 0) {
      (this.currentFilter.to = this._transactions[0].bookingDate),
        (this.currentFilter.from = this._transactions[this._transactions.length - 1].bookingDate);
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
}
