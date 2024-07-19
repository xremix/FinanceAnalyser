import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Category } from '../models/category';

@Component({
  selector: 'app-category-component',
  templateUrl: './category-component.component.html',
  styleUrls: ['./category-component.component.scss']
})
export class CategoryComponentComponent {
  @Input() public categorySummary: Category = {} as any;
  public expanded: boolean = false;
  @Input() amountMonths: number = 1;
  

}
