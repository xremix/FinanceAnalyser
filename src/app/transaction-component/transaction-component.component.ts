import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../models/transaction';

@Component({
  selector: 'app-transaction-component',
  templateUrl: './transaction-component.component.html'
})
export class TransactionComponentComponent implements OnInit {
  @Input() transaction: Transaction = {} as Transaction;
  constructor() { }
  public expand = false;
  ngOnInit(): void {
  }

}
