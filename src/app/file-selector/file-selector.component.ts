import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { DataState } from '../services/data-state';
import { ImportService } from '../services/import-service';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.scss']
})
export class FileSelectorComponent  {

  
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
