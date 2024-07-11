import { Component } from '@angular/core';
import { ImportService } from './services/import-service';
import { CategoryService } from './services/category-service';
import { DataState } from './services/data-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'FinanceAnalyser';

  constructor(private importService: ImportService, private categoryService: CategoryService, protected dataState: DataState) {}
  file: any;
  async fileChanged(e: any) {
    this.file = e.target.files[0];
    let fileContent = await this.importService.getFileContent(this.file);
    let transactions = this.importService.parseCsvToTransactions(fileContent);
   this.categoryService.fillCategoriesToTransactions(transactions);
   this.dataState.transactions = transactions;
  }
}
