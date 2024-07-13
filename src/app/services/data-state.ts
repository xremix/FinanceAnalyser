import { EventEmitter, Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { Category } from '../models/category';
import { DateService } from './date-service';
import { CategoryService } from './category-service';
@Injectable({
  providedIn: 'root',
})
export class DataState {

  private _transactions: Transaction[] = [];

  public months: Date[] = [];
  public categories: string[] = [];

  constructor(private dateService: DateService, private categoryService: CategoryService) {
  }


  get hasLoadedData(): boolean {
    return this._transactions.length > 0;
  }

  private get transactions(): Transaction[] {
    return this._transactions;
  }
  
  public setTransactions(value: Transaction[]): void {
    this._transactions = value;
    this.months = this.dateService.getMonths(this._transactions);
    this.categories = this.categoryService.getCategorySummaries(this._transactions).map((c) => c.category);
  }

  // event emitter when selected transactions change
  public selectedTransactionsChanged: EventEmitter<Transaction[]> = new EventEmitter();
  public selectedTransactions: Transaction[] = [];
  public currentFilter = {
    from: new Date(0),
    to: new Date(),
    category: undefined as string | undefined,
  };

  get selectedMonthAmountInDataRangeFilter(): number {
    var startDate = new Date(this.currentFilter.from);
    var endDate = new Date(this.currentFilter.to);
    var amountMonths = endDate.getMonth() - startDate.getMonth() 
                       + (12 * (endDate.getFullYear() - startDate.getFullYear()));
  
    return amountMonths + 1; // Include both start and end month in the count
  }


  public refresh(){
    this.selectedTransactions = this.transactions.filter(
      (t) => t.bookingDate >= this.currentFilter.from && t.bookingDate <= this.currentFilter.to
    );
    this.selectedTransactions = this.selectedTransactions.filter(
      (t) => this.currentFilter.category === undefined || t.category?.category === this.currentFilter.category
    );
    this.selectedTransactionsChanged.emit(this.selectedTransactions);
  }


  filterByRange(from: Date, to: Date) {
    this.currentFilter.from = from;
    this.currentFilter.to = to;
    this.refresh();
  }

  filterByMonth(month: Date) {
      const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
      const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  
      // Check if the selected month is already the current filter
      if (this.currentFilter.from.getTime() === firstDay.getTime() && this.currentFilter.to.getTime() === lastDay.getTime()) {
        // Reset the filter if the same month is selected again
        this.resetFilter()
      } else {
        // Set the filter to the selected month
        this.currentFilter.from = firstDay;
        this.currentFilter.to = lastDay;
        
      }
  
      this.refresh();
    }
    filterByCategory(category: string) {
      if (this.currentFilter.category === category) {
        this.currentFilter.category = undefined;
      } else {
        this.currentFilter.category = category;
      }
      this.refresh();
    }

    resetMonth(){
      if(this._transactions.length > 0){
        this.currentFilter.to = this._transactions[0].bookingDate,
        this.currentFilter.from = this._transactions[this._transactions.length - 1].bookingDate;
        this.refresh();
      }
    }
  resetFilter() {
    this.resetMonth();
  }



}