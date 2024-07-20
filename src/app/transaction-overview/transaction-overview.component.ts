import { Component } from '@angular/core';
import { DataState } from '../services/data-state';
import { Transaction } from '../models/transaction';
import { DuplicateService } from '../services/duplicate-service';

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
  constructor(protected dataState: DataState, private duplicateService: DuplicateService) {}
  duplicateTransactions: Transaction[] = [];
  
  showDuplicates() {
    this.expanded.reoccurent = !this.expanded.reoccurent;
    this.duplicateTransactions = this.duplicateService.findDuplicateTransactions();

  }
}
