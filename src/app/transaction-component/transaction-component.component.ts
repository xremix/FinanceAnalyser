import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../models/transaction';
import { DuplicateService } from '../services/duplicate-service';
import { DataState } from '../services/data-state';

@Component({
  selector: 'app-transaction-component',
  templateUrl: './transaction-component.component.html'
})
export class TransactionComponentComponent implements OnInit {
  @Input() transaction: Transaction = {} as Transaction;
  public expand = false; 
  public dupllicates: Transaction[] = [];
  constructor(public duplicateService: DuplicateService,
    private dataState: DataState
  ) { }

  ngOnInit(): void {
    this.findDuplicates();
  }
  findDuplicates() {
    this.dupllicates = this.duplicateService.foundDuplicates(this.transaction, this.dataState.selectedTransactions);
    console.log('duplicates', this.dupllicates);
  }
}
