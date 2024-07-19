import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../models/category';

@Component({
  selector: 'app-category-overview-component',
  templateUrl: './category-overview-component.component.html',
  styleUrls: ['./category-overview-component.component.scss']
})
export class CategoryOverviewComponentComponent implements OnInit {
@Input() categorySummaries: Category[] = [];
@Input() amountMonths: number = 1;
// In Ihrer übergeordneten Komponente
public trackByCategoryId(index: number, item: Category): string {
  return item.category; // Angenommen, jedes `CategorySummary`-Objekt hat eine eindeutige `id`
}
public toggle = false;
  constructor() { }

  ngOnInit(): void {
  }

}
