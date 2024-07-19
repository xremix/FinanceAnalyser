import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { Category } from '../models/category';
import { availableCategories, incomeCategory } from '../../../env';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories = availableCategories;
  public incomeCategory = incomeCategory;

  private get defaultCategory(): Category {
    return this.categories.find((c) => c.isDefault)!;
  }
  private findMatchingCategory(transaction: Transaction): Category {
    for (const category of this.categories) {
      // Überprüfen Sie zuerst die Hauptkategorie
      if (this.matchesKeywords(category, transaction)) {
        return category;
      }
  
      // Überprüfen Sie dann die Unterkategorien, falls vorhanden
      if (category.subCategories) {
        for (const subCategory of category.subCategories) {
          if (this.matchesKeywords(subCategory, transaction)) {
            return subCategory;
          }
        }
      }
    }
  
    // Standardverhalten, wenn keine Übereinstimmung gefunden wurde
    if (transaction.amount > 0) {
      return this.incomeCategory;
    }
  
    return this.defaultCategory;
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
      let category = this.findMatchingCategory(transaction);
      //transaction.category = category;
      category.transactions.push(transaction);
      category.total += transaction.amount;
    }
  }

}
