import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { TransactionComponentComponent } from './transaction-component/transaction-component.component';
import { CategoryOverviewComponentComponent } from './category-overview-component/category-overview-component.component';

@NgModule({
  declarations: [
    AppComponent,
    FileSelectorComponent,
    TransactionComponentComponent,
    CategoryOverviewComponentComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
