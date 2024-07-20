import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { Category } from '../models/category';
import { availableCategories } from '../../../env';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories = availableCategories;

  private get flatCategories(): Category[] {
    return this.categories.flatMap(c => [c, ...(c.subCategories || [])]);
  }
  private get defaultCategory(): Category {
    return this.flatCategories.find((c) => c.isDefault)!;
  }
  private get incomeCategory(): Category {
    return this.flatCategories.find((c) => c.type === 'income')!;
  }
  private findMatchingCategory(transaction: Transaction): {category: Category, parentCategory?: Category} {
    for (const category of this.categories) {
      // Überprüfen Sie zuerst die Hauptkategorie
      if (this.matchesKeywords(category, transaction)) {
        return {category};
      }
  
      // Überprüfen Sie dann die Unterkategorien, falls vorhanden
      if (category.subCategories) {
        for (const subCategory of category.subCategories) {
          if (this.matchesKeywords(subCategory, transaction)) {
            return {category: subCategory, parentCategory: category};
          }
        }
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
    return category.keywords.some(
      (keyword) =>
        transaction.payerReceiver.toUpperCase().includes(keyword.toUpperCase()) ||
        transaction.bookingText.toUpperCase().includes(keyword.toUpperCase()) ||
        transaction.purpose.toUpperCase().includes(keyword.toUpperCase())
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
