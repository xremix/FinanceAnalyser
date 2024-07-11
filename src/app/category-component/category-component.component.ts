import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CategorySummary } from '../models/category-summary';

@Component({
  selector: 'app-category-component',
  templateUrl: './category-component.component.html',
  styleUrls: ['./category-component.component.scss']
})
export class CategoryComponentComponent {
  @Input() public categorySummary: CategorySummary = {} as any;
  public expanded: boolean = false;
  

}
