import { Component, ViewChild } from '@angular/core';
import { CategoryService } from './services/category-service';
import { DataState } from './services/data-state';
import { DateService } from './services/date-service';
import { ApexAxisChartSeries, ApexChart, ApexTitleSubtitle, ApexXAxis, ChartComponent } from 'ng-apexcharts';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'FinanceAnalyser';

  constructor(protected dataState: DataState, protected categoryService: CategoryService, protected dateService: DateService) {
   
  }
}
