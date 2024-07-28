import { Component, OnInit } from '@angular/core';
import { DataState } from '../services/data-state';
import { ImportService } from '../services/import-services/import-service';
import { defaultCategories } from '../default-categories';
import { BaseCategory, Category } from '../models/category';

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
    this.importService.saveCategoriesToLocalStorage(this.importService.categorisAsJson());
    alert('Saved');
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
    const name = prompt('Add new category', '');
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
    const flatDefaults = [...defaultCategories, ...defaultCategories.flatMap((c) => c.subCategories || [])];
    const flatCatgeories = this.dataState.categories.flatMap((c) => c.subCategories || []);
    for (const category of flatCatgeories) {
      for (const defaultCategory of flatDefaults) {
        if (category.name === defaultCategory.name) {
          this.fillupCategory(category, defaultCategory);
        }
      }
    }
  }

  private fillupCategory(category: Category, defaultCategory: BaseCategory) {
    for (const keyw of defaultCategory.keywords) {
      if (!category.keywords.map(x => x.toLowerCase()).includes(keyw.toLowerCase())) {
        category.keywords.push(keyw);
        console.log('added keyword', keyw, 'to', category.name);
      }
    }
    for (const keyw of defaultCategory.excludeKeywords) {
      if (!category.excludeKeywords.map(x => x.toLowerCase()).includes(keyw.toLocaleLowerCase())) {
        category.excludeKeywords.push(keyw);
        console.log('added exclude keyword', keyw, 'to', category.name);
      }
    }
  }

  public editIcon(category: Category){
    const icon = prompt('Edit icon', category.icon);
      category.icon = icon ?? '';
  }
}
