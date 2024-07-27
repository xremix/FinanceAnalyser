import { Component, OnInit } from '@angular/core';
import { DataState } from '../services/data-state';
import { ImportService } from '../services/import-services/import-service';

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

  public addCategory(data: any[]) {
    const name = prompt('Add new category', 'Category');
    if (name) {
      data.push({
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
}
