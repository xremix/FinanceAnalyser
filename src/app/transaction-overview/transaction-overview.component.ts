import { Component } from '@angular/core';
import { DataState } from '../services/data-state';
import { Transaction } from '../models/transaction';

@Component({
  selector: 'app-transaction-overview',
  templateUrl: './transaction-overview.component.html',
  styleUrl: './transaction-overview.component.scss',
})
export class TransactionOverviewComponent {
  protected expanded = {
    all: false,
    reoccurent: false,
  };
  constructor(protected dataState: DataState) {}
  duplicateTransactions: Transaction[] = [];
  findDuplicateTransactions() {
    // check where amount and payer/receiver are the same
    // always just return the first of the similar transactions
    const duplicates = [];
    const transactions = this.dataState.selectedTransactions;
    for (let i = 0; i < transactions.length; i++) {
      console.log('checking', transactions[i]);
      if(this.foundDuplicates(transactions[i], transactions)  > 3) {
        
        // check if is already in duplicates
        if(this.foundDuplicates(transactions[i], duplicates) == 0) {

          duplicates.push(transactions[i]);
        }
      }

    }
    return duplicates;
  }
  private foundDuplicates(transaction: Transaction, transactionPool: Transaction[]): number {
    return transactionPool.filter(t => t.amount === transaction.amount && t.payerReceiver === transaction.payerReceiver && t !== transaction).length
  }
  showDuplicates() {
    this.expanded.reoccurent = !this.expanded.reoccurent;
    this.duplicateTransactions = this.findDuplicateTransactions();

  }
}
