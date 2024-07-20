import { Component } from '@angular/core';
import { DataState } from '../services/data-state';
import { TransactionComponentComponent } from '../transaction-component/transaction-component.component';

@Component({
  selector: 'app-transaction-overview',
  templateUrl: './transaction-overview.component.html',
  styleUrl: './transaction-overview.component.scss'
})
export class TransactionOverviewComponent {
  protected expanded: boolean = false;
constructor(
  protected dataState: DataState
) { }
}
