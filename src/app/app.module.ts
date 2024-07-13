import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { TransactionComponentComponent } from './transaction-component/transaction-component.component';
import { CategoryOverviewComponentComponent } from './category-overview-component/category-overview-component.component';
import { CategoryComponentComponent } from './category-component/category-component.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HistoryIncomeChartComponent } from "./history-income-chart/history-income-chart.component";
import { OrderByCategorySummary, OrderByPipe } from './pipes/orderby.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CategoryChartComponent } from './category-chart/category-chart.component';


@NgModule({
  declarations: [
    AppComponent,
    FileSelectorComponent,
    TransactionComponentComponent,
    CategoryOverviewComponentComponent,
    CategoryComponentComponent,
    OrderByPipe,
    OrderByCategorySummary
  ],
  imports: [
    BrowserModule,
    HistoryIncomeChartComponent,
    CategoryChartComponent,
    MatFormFieldModule,
     MatDatepickerModule,
     FormsModule,
     BrowserAnimationsModule
     
],
  providers: [provideNativeDateAdapter(), provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
