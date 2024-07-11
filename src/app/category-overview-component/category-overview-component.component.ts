import { Component, Input, OnInit } from '@angular/core';
import { CategorySummary } from '../models/category-summary';

@Component({
  selector: 'app-category-overview-component',
  templateUrl: './category-overview-component.component.html',
  styleUrls: ['./category-overview-component.component.scss']
})
export class CategoryOverviewComponentComponent implements OnInit {
@Input() categorySummaries: CategorySummary[] = [];
// In Ihrer übergeordneten Komponente
public trackByCategoryId(index: number, item: CategorySummary): string {
  return item.category; // Angenommen, jedes `CategorySummary`-Objekt hat eine eindeutige `id`
}
public toggle = false;
  constructor() { }

  ngOnInit(): void {
  }

}
