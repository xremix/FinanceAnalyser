import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { TransactionComponentComponent } from './transaction-component/transaction-component.component';
import { CategoryOverviewComponentComponent } from './category-overview-component/category-overview-component.component';
import { CategoryComponentComponent } from './category-component/category-component.component';
import { HistoryIncomeChartComponent } from './history-income-chart/history-income-chart.component';
import { OrderByPipe } from './pipes/orderby.pipe';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CategoryChartComponent } from './category-chart/category-chart.component';
import { CategorySelectComponent } from './category-select/category-select.component';
import { TransactionOverviewComponent } from './transaction-overview/transaction-overview.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { SettingsComponentComponent } from './settings-component/settings-component.component';
import { provideRouter, RouterOutlet } from '@angular/router';
import { OrderPipe } from './pipes/order.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DateRangePickerComponent } from './date-range-picker/date-range-picker.component';
import { MonthyBillanceComponent } from "./monthy-billance/monthy-billance.component";
import { MoneyBadgeComponent } from "./money-badge/money-badge.component";

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
    OrderPipe,
    MonthyBillanceComponent,
    DateRangePickerComponent,
  ],
  imports: [
    BrowserModule,
    HistoryIncomeChartComponent,
    CategoryChartComponent,
    FormsModule,
    BrowserAnimationsModule,
    CategorySelectComponent,
    RouterOutlet,
    NgbModule,
    MoneyBadgeComponent
],
  providers: [
    provideAnimationsAsync(),
    provideRouter([
      { path: '', component: HomeComponentComponent },
      { path: 'settings', component: SettingsComponentComponent },
    ]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
