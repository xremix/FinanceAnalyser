import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { Category } from '../models/category';
import { CategorySummary } from '../models/category-summary';
import { availableCategories, defaultCategory, incomeCategory } from '../../../env';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories = availableCategories;
  public defaultCategory = defaultCategory;
  public incomeCategory = incomeCategory;

  private categorizeTransaction(transaction: Transaction): Category {
    if(transaction.amount > 0){
      return this.incomeCategory;
    }
    for (const category of this.categories){
      if (
        category.keywords.some(
          (keyword) =>
            transaction.payerReceiver.toUpperCase().includes(keyword.toUpperCase()) ||
            transaction.bookingText.toUpperCase().includes(keyword.toUpperCase()) ||
            transaction.purpose.toUpperCase().includes(keyword.toUpperCase())
        )
      ) {
        return category;
      }
    }
  
    return this.defaultCategory;
  }

  public fillCategoriesToTransactions(transactions: Transaction[]): void {
    for (let transaction of transactions) {
      let category = this.categorizeTransaction(transaction);
      transaction.category = category;
    }
  }

  public getCategorySummaries(transactions: Transaction[]): CategorySummary[] {
    const categorySummaries: CategorySummary[] = [];
    for (const transaction of transactions) {
      const category = transaction.category;
      if (!category) {
        continue;
      }
      let categorySummary = categorySummaries.find((cs) => cs.category === category.category);
      if (!categorySummary) {
        categorySummary = {
          ...category,
          value: 0,
          transactions: [],
        };
        categorySummaries.push(categorySummary);
      }
      
      categorySummary.value += transaction.amount;
      categorySummary.transactions.push(transaction);
    }
    return categorySummaries;
  }
}
