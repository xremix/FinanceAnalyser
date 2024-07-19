import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { DataState } from '../services/data-state';
import { ImportService } from '../services/import-service';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.scss'],
})
export class FileSelectorComponent implements OnInit {
  constructor(
    private importService: ImportService,
    private categoryService: CategoryService,
    protected dataState: DataState
  ) {}
  file: any;
  async fileChanged(e: any) {
    this.file = e.target.files[0];
    let fileContent = await this.importService.getFileContent(this.file);
    localStorage.setItem('fileContent', fileContent);
    this.loadFileFromLocalStorage();
  }
  ngOnInit(): void {
    this.loadFileFromLocalStorage();
  }

  private loadFileFromLocalStorage() {
    const fileContent = localStorage.getItem('fileContent');
    if (!fileContent) {
      console.error('No file content found in local storage');
      return;
    }
    let transactions = this.importService.parseCsvToTransactions(fileContent);
    this.categoryService.fillCategoriesToTransactions(transactions);
    this.dataState.setTransactions(transactions);

    if (transactions.length > 0) {
      this.dataState.resetFilter();
    }
  }
}
