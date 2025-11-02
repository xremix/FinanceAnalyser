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
  searchTerm: string;
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
    this.duplicateService.setWasBalancedAfterwardsForAllTransaction(this._transactions);
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
    searchTerm: '',
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
    
    // Search filter logic
    const isSearchTermInFilter = this.matchesSearchTerm(transaction, this.currentFilter.searchTerm);
    
    return isBookingDateInFilter && isCategoryInFilter && isTypeInFilter && isSearchTermInFilter;
  }

  private matchesSearchTerm(transaction: Transaction, searchTerm: string): boolean {
    if (!searchTerm.trim()) {
      return true; // No search term means all transactions match
    }

    const terms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
    console.error(terms);
    const rawText = transaction.raw.toLowerCase();

    // Separate include and exclude terms
    const includeTerms = terms.filter(term => !term.startsWith('-'));
    const excludeTerms = terms.filter(term => term.startsWith('-')).map(term => term.substring(1));

    // Check exclude terms first - if ANY exclude term is found, exclude the transaction
    const hasExcludedTerm = excludeTerms.some(excludeTerm => rawText.includes(excludeTerm));
    if (hasExcludedTerm) {
      return false;
    }

    // If there are no include terms, and no excluded terms were found, include the transaction
    if (includeTerms.length === 0) {
      return true;
    }

    // Check include terms - if ANY include term is found, include the transaction
    const hasIncludedTerm = includeTerms.some(includeTerm => rawText.includes(includeTerm));
    return hasIncludedTerm;
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
    this.currentFilter.searchTerm = '';
    this.refresh();
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

  filterBySearchTerm(searchTerm: string) {
    this.currentFilter.searchTerm = searchTerm;
    this.refresh();
  }


}
