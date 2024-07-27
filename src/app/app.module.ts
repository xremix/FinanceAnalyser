import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { TransactionComponentComponent } from './transaction-component/transaction-component.component';
import { CategoryOverviewComponentComponent } from './category-overview-component/category-overview-component.component';
import { CategoryComponentComponent } from './category-component/category-component.component';
import { HistoryIncomeChartComponent } from "./history-income-chart/history-income-chart.component";
import {  OrderByPipe } from './pipes/orderby.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CategoryChartComponent } from './category-chart/category-chart.component';
import { CategorySelectComponent } from "./category-select/category-select.component";
import { TransactionOverviewComponent } from './transaction-overview/transaction-overview.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { SettingsComponentComponent } from './settings-component/settings-component.component';
import { provideRouter, RouterOutlet } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    FileSelectorComponent,
    TransactionComponentComponent,
    CategoryOverviewComponentComponent,
    CategoryComponentComponent,
    TransactionOverviewComponent,
    HomeComponentComponent,
    SettingsComponentComponent,
    OrderByPipe,
  ],
  imports: [
    BrowserModule,
    HistoryIncomeChartComponent,
    CategoryChartComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    BrowserAnimationsModule,
    CategorySelectComponent,
    RouterOutlet
],
  providers: [provideNativeDateAdapter(), provideAnimationsAsync(), provideRouter([
    
{path: '', component: HomeComponentComponent},
{path: 'settings', component: SettingsComponentComponent},
  ])],
  bootstrap: [AppComponent]
})
export class AppModule { }
