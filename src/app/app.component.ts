import { Component } from '@angular/core';
import { CategoryService } from './services/category-service';
import { DataState } from './services/data-state';
import { DateService } from './services/date-service';
import { ImportService } from './services/import-services/import-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})
export class AppComponent {
  title = 'FinanceAnalyser';
    constructor(protected dataState: DataState, private importService: ImportService,protected categoryService: CategoryService, protected dateService: DateService,
      private router: Router) {

    importService.loadFromLocalStorage();
  }

  openSettings() {
    this.router.navigate(['settings']);
  }
}
