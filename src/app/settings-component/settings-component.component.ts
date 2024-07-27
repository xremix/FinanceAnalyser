import { Component, OnInit } from '@angular/core';
import { DataState } from '../services/data-state';
import { ImportService } from '../services/import-services/import-service';
import { defaultCategories } from '../default-categories';

@Component({
  selector: 'app-settings-component',
  templateUrl: './settings-component.component.html',
  styleUrl: './settings-component.component.scss',
})
export class SettingsComponentComponent implements OnInit {
  public json: string = '';
  constructor(protected dataState: DataState, private importService: ImportService) {}

  ngOnInit(): void {
    this.json = this.importService.categorisAsJson();
  }
  public save() {
    this.importService.saveCategoriesToLocalStorage(this.json);
  }
  public saveState() {
    // let x = categorisAsJson
    const x = this.importService.categorisAsJson();
    this.importService.saveCategoriesToLocalStorage(x);
  }

  public addKeyWord(data: string[]) {
    const keyword = prompt('Add new category', 'Category');
    if (keyword) {
      data.push(keyword);
    }
  }
  public removeKeyWord(data: string[], keyword: string) {
    const index = data.indexOf(keyword);
    if (index > -1) {
      data.splice(index, 1);
    }
  }

  public addCategory(category?: any[]) {
    const name = prompt('Add new category', 'Category');
    var elementToAdd = category ? category : this.dataState.categories;
      if (name) {
        elementToAdd.push({
          name: name,
          type: 'expense',
          keywords: [],
          excludeKeywords: [],
          subCategories: [],
          isDefault: false,
          icon: 'fa fa-question',
        });
      
    }
  }

  public fillCategoriesWithDefaults() {
    // const defaults = defaultCategories;
    const flatDefaults = [...defaultCategories, ...defaultCategories.flatMap((c) => c.subCategories || [])];
    for (const category of this.dataState.categories) {
      for (const defaultCategory of flatDefaults) {
        if (category.name === defaultCategory.name) {
          this.fillupCategory(category, defaultCategory);
        }
      }
    }
  }
      

  private fillupCategory(category: any, defaultCategory: any) {
    for (const keyw of defaultCategory.keywords) {
      if (!category.keywords.includes(keyw)) {
        category.keywords.push(keyw);
      }
    }
    for (const keyw of defaultCategory.excludeKeywords) {
      if (!category.excludeKeywords.includes(keyw)) {
        category.excludeKeywords.push(keyw);
      }
    }
  }
}
