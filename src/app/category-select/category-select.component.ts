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
  styleUrl: './category-select.component.scss',
})
export class CategorySelectComponent {
  constructor(protected dataState: DataState) {}

  get categoriesCleaned(): Category[] {
    return this.dataState.categories.filter(c => c.total != 0);
  }

  get selectedSubCategoriesCleaned(): Category[] {
    return this.selectedSubCategories.filter(c => c.total != 0);
  }
  get selectedSubCategories(): Category[] {
    if(this.isSubCategorySelected){
      return this.getSubCategoriesOfParent(this.dataState.currentFilter.category!);
    }
    return this.dataState.currentFilter.category?.subCategories || [];
  }

  private getSubCategoriesOfParent(category: Category): Category[] {
    var parentCategory = this.dataState.categories.filter(c => c.subCategories.includes(category))[0];
    return parentCategory.subCategories;
  }

  get isSubCategorySelected(): boolean {
    const isCategorySelected = !!this.dataState.currentFilter.category;
    const selectedCategoryHasSubCategories = (this.dataState.currentFilter.category?.subCategories.length ?? 0) > 0;
    const isSelectedCategoryRootCategory = isCategorySelected && this.dataState.categories.includes(this.dataState.currentFilter.category!)
    return isCategorySelected &&  !selectedCategoryHasSubCategories && !isSelectedCategoryRootCategory;
  }
  isSelectedCategory(category: Category): boolean {
    return this.dataState.currentFilter.category === category;
  }

  isNothingSelected(): boolean {
    return !this.dataState.currentFilter.category;
  }

  isChildCategorySelected(category: Category): boolean {
    return this.dataState.currentFilter.category?.subCategories.includes(category) === true;
  }
}
