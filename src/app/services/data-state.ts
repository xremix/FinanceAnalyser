import { EventEmitter, Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { Category } from '../models/category';
import { DateService } from './date-service';
@Injectable({
  providedIn: 'root',
})
export class DataState {

  private _transactions: Transaction[] = [];

  public months: Date[] = [];

  constructor(private dateService: DateService) {
  }

  public getMonths(): Date[] {  
    return this.months;
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
  }

  // event emitter when selected transactions change
  public selectedTransactionsChanged: EventEmitter<Transaction[]> = new EventEmitter();
  public selectedTransactions: Transaction[] = [];
  public dateRangeFilter = {
    from: new Date(0),
    to: new Date(),
  };

  get selectedMonthAmountInDataRangeFilter(): number {
    var startDate = new Date(this.dateRangeFilter.from);
    var endDate = new Date(this.dateRangeFilter.to);
    var amountMonths = endDate.getMonth() - startDate.getMonth() 
                       + (12 * (endDate.getFullYear() - startDate.getFullYear()));
  
    return amountMonths + 1; // Include both start and end month in the count
  }


  public refresh(){
    this.selectedTransactions = this.transactions.filter(
      (t) => t.bookingDate >= this.dateRangeFilter.from && t.bookingDate <= this.dateRangeFilter.to
    );
    this.selectedTransactionsChanged.emit(this.selectedTransactions);
  }


  filterByRange(from: Date, to: Date) {
    this.dateRangeFilter = {
      from: from,
      to: to,
    };
    this.refresh();
  }

  filterByMonth(month: Date) {
      const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
      const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  
      // Check if the selected month is already the current filter
      if (this.dateRangeFilter.from.getTime() === firstDay.getTime() && this.dateRangeFilter.to.getTime() === lastDay.getTime()) {
        // Reset the filter if the same month is selected again
        this.resetFilter()
      } else {
        // Set the filter to the selected month
        this.dateRangeFilter = {
          from: firstDay,
          to: lastDay,
        };
      }
  
      this.refresh();
    }

  resetFilter() {
    if(this._transactions.length > 0){
      this.dateRangeFilter = {
        to: this._transactions[0].bookingDate,
        from: this._transactions[this._transactions.length - 1].bookingDate,
      };
      this.refresh();
    }
  }
}
