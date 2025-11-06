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

  public async loadAdditionalFile(fileContent: string, fileName: string): Promise<void> {
    try {
      let newTransactions = this.parseCsvToTransactions(fileContent);
      
      if (newTransactions.length === 0) {
        throw new Error('No transactions found in the file. Please check the format.');
      }

      // Fill categories for new transactions
      this.categoryService.fillCategoriesToTransactions(newTransactions);

      // Add source information to transactions
      newTransactions.forEach(transaction => {
        transaction.source = fileName;
      });

      // Save additional file to localStorage
      this.saveAdditionalFileToLocalStorage(fileContent, fileName);

      // Add to existing transactions
      this.dataState.addTransactions(newTransactions);

      console.log(`Successfully loaded ${newTransactions.length} transactions from ${fileName}`);
    } catch (error) {
      console.error('Error loading additional file:', error);
      throw error;
    }
  }

  private saveAdditionalFileToLocalStorage(fileContent: string, fileName: string): void {
    const additionalFiles = this.getAdditionalFilesFromLocalStorage();
    const fileData = {
      fileName,
      content: fileContent,
      uploadedAt: new Date().toISOString()
    };
    
    // Check if file already exists and replace it, otherwise add new
    const existingIndex = additionalFiles.findIndex(f => f.fileName === fileName);
    if (existingIndex >= 0) {
      additionalFiles[existingIndex] = fileData;
    } else {
      additionalFiles.push(fileData);
    }
    
    localStorage.setItem('additionalFiles', JSON.stringify(additionalFiles));
  }

  private getAdditionalFilesFromLocalStorage(): Array<{fileName: string, content: string, uploadedAt: string}> {
    const stored = localStorage.getItem('additionalFiles');
    return stored ? JSON.parse(stored) : [];
  }

  public loadAdditionalFilesFromLocalStorage(): void {
    const additionalFiles = this.getAdditionalFilesFromLocalStorage();
    
    for (const fileData of additionalFiles) {
      try {
        let transactions = this.parseCsvToTransactions(fileData.content);
        this.categoryService.fillCategoriesToTransactions(transactions);
        
        // Add source information to transactions
        transactions.forEach(transaction => {
          transaction.source = fileData.fileName;
        });

        // Add to existing transactions
        this.dataState.addTransactions(transactions);
        
        console.log(`Loaded ${transactions.length} transactions from stored file: ${fileData.fileName}`);
      } catch (error) {
        console.error(`Error loading stored additional file ${fileData.fileName}:`, error);
      }
    }
  }

  public clearAdditionalFilesFromLocalStorage(): void {
    localStorage.removeItem('additionalFiles');
  }

  constructor(private categoryService: CategoryService, private dataState: DataState) {}


  public loadFromLocalStorage(){
    this.loadCategoriesFromLocalStorage();
    this.loadFileFromLocalStorage();
    this.loadAdditionalFilesFromLocalStorage();
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
