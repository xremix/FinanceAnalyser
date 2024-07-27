import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Category } from '../models/category';
import { DataState } from '../services/data-state';

@Component({
  selector: 'app-category-component',
  templateUrl: './category-component.component.html',
  styleUrls: ['./category-component.component.scss']
})
export class CategoryComponentComponent {
  @Input() public categorySummary: Category = {} as any;
  @Input() public expanded: boolean = false;
  @Input() amountMonths: number = 1;
  constructor(protected dataState: DataState

  ) { }

  protected get calculatedTotal() {
    const transactionValues = this.activeTransactions.map(t => t.amount);
    return transactionValues.reduce((a, b) => a + b, 0);
  }
  
  protected get activeTransactions() {
    //return this.categorySummary.transactions.flatMap(t => [t, ...(t.?.flatMap(subCat => subCat.transactions) || [])]);
    return this.categorySummary.subCategories.flatMap(sc => sc.transactions).concat(this.categorySummary.transactions).filter(t => this.dataState.showTransaction(t));
  }
}
