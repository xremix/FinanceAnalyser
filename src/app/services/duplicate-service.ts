import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';
import { DataState, DateFilter } from './data-state';

@Injectable({
  providedIn: 'root',
})
export class DuplicateService {
  public setWasBalancedAfterwardsForAllTransaction(transactions: Transaction[]){
    // Create a copy of the transactions array to avoid modifying the original
    let remainingTransactions = [...transactions];

    // Function to remove a transaction from the remaining transactions
    const removeTransaction = (trans: Transaction) => {
      const index = remainingTransactions.findIndex(t => t === trans);
      if (index !== -1) {
        remainingTransactions.splice(index, 1);
      }
    };
    
    transactions.forEach((transaction, index) => {
      if (transaction.amount < 0) {
        const positiveMatch = this.findPositiveMatch(transaction, remainingTransactions);
        if(!!positiveMatch){
          transaction.balancedByDescription = `Ausgeglichen mit ${positiveMatch.payerReceiver} ${positiveMatch.purpose} am ${positiveMatch.bookingDate.toLocaleDateString()}`;
          positiveMatch.balancedOfDescription = `Ausgeglich für ${transaction.payerReceiver} ${transaction.purpose} am ${transaction.bookingDate.toLocaleDateString()}`;
          removeTransaction(positiveMatch);
        }
      }
    });
  }

  private findPositiveMatch(negativeTransaction: Transaction, transactionPool: Transaction[]): Transaction | undefined {
    if (negativeTransaction.amount >= 0) {
      return undefined; // Only process negative transactions
    }


    const matches = transactionPool.find(transaction => 
      transaction.amount === Math.abs(negativeTransaction.amount) &&
      transaction.bookingDate >= new Date(negativeTransaction.bookingDate.getTime() - 7 * 24 * 60 * 60 * 1000) &&
      transaction.category === negativeTransaction.category
    );
    return matches;
  }
}
