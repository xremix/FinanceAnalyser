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
    // Save timestamp when categories were saved
    localStorage.setItem('categoriesLastSaved', new Date().toISOString());
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
          icon: '',
        });
      
    }
  }

  public deleteCategory(category: Category) {
    const confirmDelete = confirm(`Are you sure you want to delete the category "${category.name}"?`);
    if (confirmDelete) {
      // Find the parent array containing this category
      let parentArray = this.dataState.categories;
      let index = parentArray.indexOf(category);

      // If not found in the main categories, search in subcategories
      if (index === -1) {
        for (let mainCategory of this.dataState.categories) {
          index = mainCategory.subCategories.indexOf(category);
          if (index !== -1) {
            parentArray = mainCategory.subCategories;
            break;
          }
        }
      }

      // Remove the category if found
      if (index !== -1) {
        parentArray.splice(index, 1);
        console.log(`Deleted category: ${category.name}`);
      } else {
        console.error(`Category not found: ${category.name}`);
      }
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

  public renameCategory(category: Category) {
    const newName = prompt('Kategorie umbenennen', category.name);
    if (newName && newName.trim() !== '') {
      category.name = newName.trim();
    }
  }

  public toggleType(category: Category){
    // toggle between 'savings' | 'income' | 'expense';
    if(category.type === 'savings'){
      category.type = 'income';
    } else if(category.type === 'income'){
      category.type = 'expense';
    } else {
      category.type = 'savings';
    }
  }

  public getLastSavedDate(): string | null {
    const lastSaved = localStorage.getItem('categoriesLastSaved');
    if (lastSaved) {
      return new Date(lastSaved).toLocaleString('de-DE');
    }
    return null;
  }

  public getAddedCategoriesCount(): number {
    const flattenCategories = (categories: Category[]): Category[] => {
      return categories.reduce((acc: Category[], category) => {
        acc.push(category);
        if (category.subCategories && category.subCategories.length > 0) {
          acc.push(...flattenCategories(category.subCategories));
        }
        return acc;
      }, []);
    };

    const flattenDefaultCategories = (categories: BaseCategory[]): BaseCategory[] => {
      return categories.reduce((acc: BaseCategory[], category) => {
        acc.push(category);
        if (category.subCategories && category.subCategories.length > 0) {
          acc.push(...flattenDefaultCategories(category.subCategories));
        }
        return acc;
      }, []);
    };

    const currentCategories = flattenCategories(this.dataState.categories);
    const defaultCats = flattenDefaultCategories(defaultCategories);
    
    // Count categories that are not in defaults (either by name or marked as not default)
    return currentCategories.filter(cat => 
      !defaultCats.some(def => def.name === cat.name) || cat.isDefault === false
    ).length;
  }

  public getAddedKeywordsCount(): { include: number, exclude: number } {
    const flattenCategories = (categories: Category[]): Category[] => {
      return categories.reduce((acc: Category[], category) => {
        acc.push(category);
        if (category.subCategories && category.subCategories.length > 0) {
          acc.push(...flattenCategories(category.subCategories));
        }
        return acc;
      }, []);
    };

    const flattenDefaultCategories = (categories: BaseCategory[]): BaseCategory[] => {
      return categories.reduce((acc: BaseCategory[], category) => {
        acc.push(category);
        if (category.subCategories && category.subCategories.length > 0) {
          acc.push(...flattenDefaultCategories(category.subCategories));
        }
        return acc;
      }, []);
    };

    const currentCategories = flattenCategories(this.dataState.categories);
    const defaultCats = flattenDefaultCategories(defaultCategories);
    
    let addedIncludeKeywords = 0;
    let addedExcludeKeywords = 0;

    for (const currentCat of currentCategories) {
      const defaultCat = defaultCats.find(def => def.name === currentCat.name);
      if (defaultCat) {
        // Count keywords that are in current but not in default
        addedIncludeKeywords += currentCat.keywords.filter(keyword => 
          !defaultCat.keywords.some(defKeyword => defKeyword.toLowerCase() === keyword.toLowerCase())
        ).length;

        addedExcludeKeywords += currentCat.excludeKeywords.filter(keyword => 
          !defaultCat.excludeKeywords.some(defKeyword => defKeyword.toLowerCase() === keyword.toLowerCase())
        ).length;
      } else {
        // If category doesn't exist in defaults, count all its keywords as added
        addedIncludeKeywords += currentCat.keywords.length;
        addedExcludeKeywords += currentCat.excludeKeywords.length;
      }
    }

    return { include: addedIncludeKeywords, exclude: addedExcludeKeywords };
  }

  public isDefaultKeyword(category: Category, keyword: string, isExclude: boolean = false): boolean {
    const flattenDefaultCategories = (categories: BaseCategory[]): BaseCategory[] => {
      return categories.reduce((acc: BaseCategory[], category) => {
        acc.push(category);
        if (category.subCategories && category.subCategories.length > 0) {
          acc.push(...flattenDefaultCategories(category.subCategories));
        }
        return acc;
      }, []);
    };

    const defaultCats = flattenDefaultCategories(defaultCategories);
    const defaultCat = defaultCats.find(def => def.name === category.name);
    
    if (!defaultCat) {
      return false;
    }

    const keywordsToCheck = isExclude ? defaultCat.excludeKeywords : defaultCat.keywords;
    return keywordsToCheck.some(defKeyword => defKeyword.toLowerCase() === keyword.toLowerCase());
  }

  public getKeywordClass(category: Category, keyword: string, isExclude: boolean = false): string {
    const isDefault = this.isDefaultKeyword(category, keyword, isExclude);
    
    if (isExclude) {
      return isDefault ? 'badge rounded-pill p-2 text-bg-light border' : 'badge rounded-pill p-2 text-bg-danger';
    } else {
      return isDefault ? 'badge rounded-pill p-2 text-bg-light border' : 'badge rounded-pill p-2 text-bg-primary';
    }
  }
}
