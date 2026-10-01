import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../models/transaction';
import { DuplicateService } from '../services/duplicate-service';
import { DataState } from '../services/data-state';
import { CategoryService } from '../services/category-service';

@Component({
  selector: 'app-transaction-component',
  templateUrl: './transaction-component.component.html',
  styleUrl: './transaction-component.component.scss'
})
export class TransactionComponentComponent implements OnInit {
  @Input() transaction: Transaction = {} as Transaction;
  public expand = false; 
  public duplicates: Transaction[] = [];
  constructor(public duplicateService: DuplicateService,
    private dataState: DataState,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.findDuplicates();
  }
  findDuplicates() {
    this.duplicates = this.duplicateService.foundDuplicates(this.transaction, this.dataState.selectedTransactions);
  }

  get dayLabel(): string {
    return new Date(this.transaction.bookingDate).toLocaleDateString('de-DE', { day: '2-digit' });
  }

  get monthLabel(): string {
    return this.formatMonth(this.transaction.bookingDate);
  }

  formatMonth(date: Date): string {
    return new Date(date).toLocaleDateString('de-DE', { month: 'short', year: '2-digit' });
  }

  get amountClass(): string {
    if (this.transaction.balancedByDescription || this.transaction.balancedOfDescription) {
      return 'is-balanced';
    }
    return this.transaction.amount > 0 ? 'is-income' : 'is-expense';
  }

  showMatchingKeywords(transaction: Transaction){
    let keywords = this.categoryService.flatCategories.map((category) => {
      const matchingKeyWords = this.categoryService.matchingKeywords(category, transaction);
      return matchingKeyWords;
    }).filter((keywords) => keywords.length > 0);

    alert('The following key words matched:\n' + keywords);


  }
}
