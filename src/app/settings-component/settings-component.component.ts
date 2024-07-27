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
}
