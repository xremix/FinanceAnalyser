import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { Category } from '../models/category';
import { DataState } from './data-state';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  /**
   * Sortiert Kategorien so, dass lowPrio-Kategorien hinten stehen
   */
  private sortLowPrio<T extends { lowPrio?: boolean }>(arr: T[]): T[] {
    return [...arr].sort((a, b) => {
      const aPrio = !!a.lowPrio ? 1 : 0;
      const bPrio = !!b.lowPrio ? 1 : 0;
        console.log(a.lowPrio, b.lowPrio);
      return aPrio - bPrio;
    });
  }

  constructor(private dataState: DataState) {
  }

  public get flatCategories(): Category[] {
    return this.dataState.categories.flatMap(c => [c, ...(c.subCategories || [])]);
  }
  private get defaultCategory(): Category {
    return this.flatCategories.find((c) => c.isDefault)!;
  }
  private get incomeCategory(): Category {
    return this.flatCategories.find((c) => c.type === 'income')!;
  }
  private findMatchingCategory(transaction: Transaction): {category: Category, parentCategory?: Category} {
    // Alle Kategorien und Subkategorien in ein Array laden
    const allCategories: {category: Category, parentCategory?: Category}[] = [];
    for (const category of this.dataState.categories) {
      allCategories.push({category});
      if (category.subCategories) {
        for (const subCategory of category.subCategories) {
          allCategories.push({category: subCategory, parentCategory: category});
        }
      }
    }
    // Sortiere nach lowPrio
    const sortedAll = this.sortLowPrio(allCategories.map(c => c.category)).map(cat => {
      // Finde parentCategory falls Subkategorie
      const found = allCategories.find(c => c.category === cat);
      return found!;
    });
    // Suche nach passender Kategorie
    for (const entry of sortedAll) {
      if (this.matchesKeywords(entry.category, transaction) && !this.matchesExcludeKeywords(entry.category, transaction)) {
        return entry;
      }
    }
  
    // Standardverhalten, wenn keine Übereinstimmung gefunden wurde
    if (transaction.amount > 0) {
      return {category: this.incomeCategory};
    }
  
    return {category: this.defaultCategory};
  }
  
  // Hilfsfunktion, um den Code sauber zu halten
  private matchesKeywords(category: Category, transaction: Transaction): boolean {
    return this.matchingKeywords(category, transaction).length > 0;
  }
  private matchesExcludeKeywords(category: Category, transaction: Transaction): boolean {
    return this.matchingExcludeKeywords(category, transaction).length > 0;
  }

  public matchingKeywords(category: Category, transaction: Transaction): string[] {
    return category.keywords.filter(
      (keyword) =>
        transaction.raw.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  private matchingExcludeKeywords(category: Category, transaction: Transaction): string[] {
    return category.excludeKeywords.filter(
      (keyword) =>
        transaction.raw.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  public fillCategoriesToTransactions(transactions: Transaction[]): void {
    for (let transaction of transactions) {
      let foundCategory = this.findMatchingCategory(transaction);
      transaction.category = foundCategory.category;
      foundCategory.category.transactions.push(transaction);
      foundCategory.category.total += transaction.amount;

      if(foundCategory.parentCategory){
        // foundCategory.parentCategory.transactions.push(transaction);
        foundCategory.parentCategory.total += transaction.amount;
      }
    }
  }

}
