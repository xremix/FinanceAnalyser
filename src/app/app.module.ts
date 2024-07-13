import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { TransactionComponentComponent } from './transaction-component/transaction-component.component';
import { CategoryOverviewComponentComponent } from './category-overview-component/category-overview-component.component';
import { CategoryComponentComponent } from './category-component/category-component.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LineIncomeComponentComponent } from "./line-income-component/line-income-component.component";


@NgModule({
  declarations: [
    AppComponent,
    FileSelectorComponent,
    TransactionComponentComponent,
    CategoryOverviewComponentComponent,
    CategoryComponentComponent
  ],
  imports: [
    BrowserModule,
    LineIncomeComponentComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
