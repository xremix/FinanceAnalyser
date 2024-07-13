import { Component } from '@angular/core';
import { CategoryService } from './services/category-service';
import { DataState } from './services/data-state';
import { DateService } from './services/date-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})
export class AppComponent {
  title = 'FinanceAnalyser';


  constructor(protected dataState: DataState, protected categoryService: CategoryService, protected dateService: DateService) {}
  isSelectedMonth(date: Date): boolean {
    if (!this.dataState.dateRangeFilter.from || !this.dataState.dateRangeFilter.to) {
      return false;
    }
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return this.dataState.dateRangeFilter.from.getTime() === firstDay.getTime() && this.dataState.dateRangeFilter.to.getTime() === lastDay.getTime();
  }
  public refreshData(){
    debugger;
    this.dataState.refresh();
  }
}
