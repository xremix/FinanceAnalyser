import { Component } from '@angular/core';
import { ImportService } from './services/import-service';
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

}
