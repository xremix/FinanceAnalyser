import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { DataState, DateFilter } from './data-state';

@Injectable({
  providedIn: 'root',
})
export class DuplicateService {

    findDuplicateTransactions(selectedTransactions: Transaction[]): Transaction[] {
    // check where amount and payer/receiver are the same
    // always just return the first of the similar transactions
    const duplicates = [];
    const transactions = selectedTransactions;
    for (let i = 0; i < transactions.length; i++) {
      if(this.foundDuplicates(transactions[i], transactions).length  >= 3) {
        
        // check if is already in duplicates
        if(this.foundDuplicates(transactions[i], duplicates).length == 0) {

          duplicates.push(transactions[i]);
        }
      }

    }
    return duplicates;
  }
  public foundDuplicates(transaction: Transaction, transactionPool: Transaction[]): Transaction[] {
    return transactionPool.filter(t => t.amount === transaction.amount && t.payerReceiver === transaction.payerReceiver && t !== transaction)
  }
}