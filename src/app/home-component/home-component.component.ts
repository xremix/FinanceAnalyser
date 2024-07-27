import { Component } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { DataState, DateFilter } from '../services/data-state';
import { DateService } from '../services/date-service';
import { ImportService } from '../services/import-services/import-service';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.scss'
})
export class HomeComponentComponent {

  constructor(protected dataState: DataState, private importService: ImportService,protected categoryService: CategoryService, protected dateService: DateService) {
    //importService.loadFromLocalStorage();
  }
  
  isSelectedMonth(date: DateFilter): boolean {
    if (!this.dataState.currentFilter.from || !this.dataState.currentFilter.to) {
      return false;
    }
    
    return this.dataState.currentFilter.from.getTime() === date.from.getTime() && this.dataState.currentFilter.to.getTime() === date.to.getTime();
  }



  public refreshData(){
    this.dataState.refresh();
  }



  // this.today = new Date();
  // this.sixMonthsAgo = new Date();
  // this.sixMonthsAgo.setMonth(this.today.getMonth() - 6);

  openDatePicker(dp: any) {
    dp.open();
  }

  closeDatePicker(eventData: any, dp?:any) {
    // get month and year from eventData and close datepicker, thus not allowing user to select date
    dp.close();    
  }
}
