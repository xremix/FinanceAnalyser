import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../models/category';
import { DataState } from '../services/data-state';

@Component({
  selector: 'app-category-overview-component',
  templateUrl: './category-overview-component.component.html',
  styleUrls: ['./category-overview-component.component.scss']
})
export class CategoryOverviewComponentComponent implements OnInit {
@Input() categorySummaries: Category[] = [];
@Input() amountMonths: number = 1;
public trackByCategoryId(index: number, item: Category): string {
  return item.name;
}
  constructor(protected dataState: DataState) { }

  ngOnInit(): void {
  }

}
