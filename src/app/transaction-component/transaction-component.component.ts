import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../models/transaction';
import { DuplicateService } from '../services/duplicate-service';
import { DataState } from '../services/data-state';
import { CategoryService } from '../services/category-service';

@Component({
  selector: 'app-transaction-component',
  templateUrl: './transaction-component.component.html'
})
export class TransactionComponentComponent implements OnInit {
  @Input() transaction: Transaction = {} as Transaction;
  public expand = false; 
  public dupllicates: Transaction[] = [];
  constructor(public duplicateService: DuplicateService,
    private dataState: DataState,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.findDuplicates();
  }
  findDuplicates() {
    this.dupllicates = this.duplicateService.foundDuplicates(this.transaction, this.dataState.selectedTransactions);
  }

  showMatchingKeywords(transaction: Transaction){
    let keywords = this.categoryService.flatCategories.map((category) => {
      const matchingKeyWords = this.categoryService.matchingKeywords(category, transaction);
      return matchingKeyWords;
    }).filter((keywords) => keywords.length > 0);

    alert('The following key words matched:\n' + keywords);


  }
}
