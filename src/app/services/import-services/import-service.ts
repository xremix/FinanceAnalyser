import { Injectable } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { DataState } from '../data-state';
import { CategoryService } from '../category-service';
import { IngImporter } from './ing-importer';
import { SpkImporter } from './spk-importer';
import { Importer } from './importer';
import { defaultCategories } from 'src/app/default-categories';
import { BaseCategory, mapBaseCategoryToCategory, mapCategoryToBaseCategory } from 'src/app/models/category';
@Injectable({
  providedIn: 'root',
})
export class ImportService {
  private importServices: Importer[] = [new SpkImporter(), new IngImporter()];

  public async getFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      fileReader.readAsText(file);
    });
  }

  public parseCsvToTransactions(csvData: string): Transaction[] {
    const transactions: Transaction[] = [];
    for (const importService of this.importServices) {
      if (importService.canParseCSV(csvData)) {
        return importService.parseCsvToTransactions(csvData);
      }
    }

    return transactions;
  }

  public loadFileFromLocalStorage() {
    this.dataState.resetState();
    const fileContent = localStorage.getItem('fileContent');
    if (!fileContent) {
      console.error('No file content found in local storage');
      return;
    }
    let transactions = this.parseCsvToTransactions(fileContent);
    this.categoryService.fillCategoriesToTransactions(transactions);
    this.dataState.setTransactions(transactions);

    if (transactions.length > 0) {
      this.dataState.resetFilter();
    }
  }

  constructor(private categoryService: CategoryService, private dataState: DataState) {}


  public loadFromLocalStorage(){
    this.loadCategoriesFromLocalStorage();
    this.loadFileFromLocalStorage();

  }

  private loadCategoriesFromLocalStorage() {
    let baseCategories: BaseCategory[] = localStorage.getItem('categories') ? JSON.parse(localStorage.getItem('categories')!) : defaultCategories;
    this.dataState.categories = baseCategories.map((c) => mapBaseCategoryToCategory(c));
  }

  public saveCategoriesToLocalStorage(json: string) {
    
    localStorage.setItem('categories', json);
  }
  public categorisAsJson(): string {
    let baseCategories: BaseCategory[] = this.dataState.categories.map((c) => mapCategoryToBaseCategory(c));
    return JSON.stringify(baseCategories, null, 2);
  }
}
