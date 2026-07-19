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
  private readonly categoriesFileDbName = 'FinanceAnalyser';
  private readonly categoriesFileStoreName = 'fileHandles';
  private readonly categoriesFileHandleKey = 'categoriesFileHandle';

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
      this.dataState.resetFilter(false);
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


  public async loadFromLocalStorage(){
    const loadedFromFile = await this.loadCategoriesFromLinkedFile();
    if (!loadedFromFile) {
      this.loadCategoriesFromLocalStorage();
    }
    this.loadFileFromLocalStorage();
    this.loadAdditionalFilesFromLocalStorage();
  }

  private loadCategoriesFromLocalStorage() {
    let baseCategories: BaseCategory[] = localStorage.getItem('categories') ? JSON.parse(localStorage.getItem('categories')!) : defaultCategories;
    this.dataState.categories = baseCategories.map((c) => mapBaseCategoryToCategory(c));
  }

  public saveCategoriesToLocalStorage(json: string) {
    
    localStorage.setItem('categories', json);
    localStorage.setItem('categoriesLastSaved', new Date().toISOString());
  }

  public supportsCategoriesFileSync(): boolean {
    const fileWindow = window as any;
    return !!fileWindow.showOpenFilePicker && !!fileWindow.showSaveFilePicker;
  }

  public async hasLinkedCategoriesFile(): Promise<boolean> {
    const handle = await this.getStoredCategoriesFileHandle();
    return !!handle;
  }

  public async getLinkedCategoriesFileName(): Promise<string | null> {
    const handle = await this.getStoredCategoriesFileHandle();
    return handle?.name ?? null;
  }

  public async loadCategoriesFromUserSelectedFile(): Promise<boolean> {
    if (!this.supportsCategoriesFileSync()) {
      return false;
    }

    const fileWindow = window as any;
    const handles = await fileWindow.showOpenFilePicker({
      multiple: false,
      types: [
        {
          description: 'JSON settings file',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    });

    const handle = handles?.[0];
    if (!handle) {
      return false;
    }

    const loaded = await this.loadCategoriesFromFileHandle(handle, true);
    if (loaded) {
      await this.storeCategoriesFileHandle(handle);
    }

    return loaded;
  }

  public async saveCategoriesToFile(json: string): Promise<boolean> {
    if (!this.supportsCategoriesFileSync()) {
      return false;
    }

    let handle = await this.getStoredCategoriesFileHandle();
    if (!handle) {
      handle = await this.selectCategoriesFileForSaving();
      if (!handle) {
        return false;
      }
      await this.storeCategoriesFileHandle(handle);
    }

    const writeSuccessful = await this.writeCategoriesToFileHandle(handle, json, true);
    if (!writeSuccessful) {
      return false;
    }

    this.saveCategoriesToLocalStorage(json);
    return true;
  }

  public async saveCategoriesToLocalStorageAndLinkedFile(json: string): Promise<boolean> {
    this.saveCategoriesToLocalStorage(json);
    const handle = await this.getStoredCategoriesFileHandle();
    if (!handle) {
      return true;
    }

    return this.writeCategoriesToFileHandle(handle, json, true);
  }

  public async loadCategoriesFromLinkedFile(): Promise<boolean> {
    const handle = await this.getStoredCategoriesFileHandle();
    if (!handle) {
      return false;
    }

    const loaded = await this.loadCategoriesFromFileHandle(handle, false);
    if (!loaded) {
      return false;
    }

    const categoriesJson = this.categorisAsJson();
    this.saveCategoriesToLocalStorage(categoriesJson);
    return true;
  }

  private async loadCategoriesFromFileHandle(handle: any, requestPermission: boolean): Promise<boolean> {
    const canRead = await this.ensurePermission(handle, 'read', requestPermission);
    if (!canRead) {
      return false;
    }

    try {
      const file = await handle.getFile();
      const content = await file.text();
      const baseCategories: BaseCategory[] = JSON.parse(content);

      if (!Array.isArray(baseCategories)) {
        throw new Error('The selected file does not contain a valid settings array.');
      }

      this.dataState.categories = baseCategories.map((c) => mapBaseCategoryToCategory(c));
      return true;
    } catch (error) {
      console.error('Error while loading categories from file:', error);
      return false;
    }
  }

  private async writeCategoriesToFileHandle(handle: any, json: string, requestPermission: boolean): Promise<boolean> {
    const canWrite = await this.ensurePermission(handle, 'readwrite', requestPermission);
    if (!canWrite) {
      return false;
    }

    try {
      const writable = await handle.createWritable();
      await writable.write(json);
      await writable.close();
      return true;
    } catch (error) {
      console.error('Error while writing categories to file:', error);
      return false;
    }
  }

  private async selectCategoriesFileForSaving(): Promise<any | null> {
    const fileWindow = window as any;
    if (!fileWindow.showSaveFilePicker) {
      return null;
    }

    return fileWindow.showSaveFilePicker({
      suggestedName: 'financeanalyser-settings.json',
      types: [
        {
          description: 'JSON settings file',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    });
  }

  private async ensurePermission(handle: any, mode: 'read' | 'readwrite', requestPermission: boolean): Promise<boolean> {
    const options = { mode } as any;

    if (handle.queryPermission) {
      const permission = await handle.queryPermission(options);
      if (permission === 'granted') {
        return true;
      }
    }

    if (!requestPermission || !handle.requestPermission) {
      return false;
    }

    const requestedPermission = await handle.requestPermission(options);
    return requestedPermission === 'granted';
  }

  private async openCategoriesFileDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.categoriesFileDbName, 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.categoriesFileStoreName)) {
          db.createObjectStore(this.categoriesFileStoreName);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async storeCategoriesFileHandle(handle: any): Promise<void> {
    const db = await this.openCategoriesFileDb();

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.categoriesFileStoreName, 'readwrite');
      tx.objectStore(this.categoriesFileStoreName).put(handle, this.categoriesFileHandleKey);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    db.close();
  }

  private async getStoredCategoriesFileHandle(): Promise<any | null> {
    try {
      const db = await this.openCategoriesFileDb();

      const handle = await new Promise<any | null>((resolve, reject) => {
        const tx = db.transaction(this.categoriesFileStoreName, 'readonly');
        const request = tx.objectStore(this.categoriesFileStoreName).get(this.categoriesFileHandleKey);
        request.onsuccess = () => resolve(request.result ?? null);
        request.onerror = () => reject(request.error);
      });

      db.close();
      return handle;
    } catch (error) {
      console.error('Error while reading stored categories file handle:', error);
      return null;
    }
  }

  public categorisAsJson(): string {
    let baseCategories: BaseCategory[] = this.dataState.categories.map((c) => mapCategoryToBaseCategory(c));
    return JSON.stringify(baseCategories, null, 2);
  }
}
