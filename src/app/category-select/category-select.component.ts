import { Component } from '@angular/core';
import { DataState } from '../services/data-state';
import { Category } from '../models/category';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-select',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './category-select.component.html',
  styleUrl: './category-select.component.scss'
})
export class CategorySelectComponent {
constructor(protected dataState: DataState){}
isSelectedCategory(category: Category): boolean {
  return this.dataState.currentFilter.category === category;
}
}
