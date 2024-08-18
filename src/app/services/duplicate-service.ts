import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { DataState, DateFilter } from './data-state';

@Injectable({
  providedIn: 'root',
})
export class DuplicateService {
  findDuplicateTransactions(selectedTransactions: Transaction[]): Transaction[] {
    const duplicates = [];
    const transactions = selectedTransactions;
    for (let i = 0; i < transactions.length; i++) {
      if (this.foundDuplicates(transactions[i], transactions).length >= 3) {
        // check if is already in duplicates
        if (this.foundDuplicates(transactions[i], duplicates).length == 0) {
          duplicates.push(transactions[i]);
        }
      }
    }
    return duplicates;
  }
  public foundDuplicates(transaction: Transaction, transactionPool: Transaction[]): Transaction[] {
    return transactionPool.filter(
      (t) => t.amount === transaction.amount && t.payerReceiver === transaction.payerReceiver && t !== transaction
    );
  }

  public setWasBalancedAfterwardsForAllTransaction(transactions: Transaction[]){
    transactions.forEach((transaction, index) => {
      if (transaction.amount < 0) {
        const positiveMatch = this.findPositiveMatch(transaction, transactions);
        if(!!positiveMatch){
          transaction.balancedByDescription = `Ausgeglichen mit ${positiveMatch.payerReceiver} ${positiveMatch.purpose} am ${positiveMatch.bookingDate.toLocaleDateString()}`;
        }

      } else {
      }
    });
  }

  private findPositiveMatch(negativeTransaction: Transaction, transactionPool: Transaction[]): Transaction | undefined {
    if (negativeTransaction.amount >= 0) {
      return undefined; // Only process negative transactions
    }


    const matches = transactionPool.find(transaction => 
      transaction.amount === Math.abs(negativeTransaction.amount) &&
      transaction.bookingDate >= negativeTransaction.bookingDate &&
      transaction.category === negativeTransaction.category
    );
    return matches;
  }
}
