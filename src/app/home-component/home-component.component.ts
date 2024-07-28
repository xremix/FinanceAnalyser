import { ChangeDetectorRef, Component } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { DataState, DateFilter } from '../services/data-state';
import { DateService } from '../services/date-service';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.scss',
})
export class HomeComponentComponent {
  public tabs: string[] = ['Kategorien', 'Wiederkehrende Buchungen', 'Alle', 'Monatliche Bilanz'];
  public activeTab: string = this.tabs[0];

  constructor(
    protected dataState: DataState,
    protected categoryService: CategoryService,
    protected dateService: DateService,
    private cds: ChangeDetectorRef
  ) {}

  hasSelectedMonth(): boolean {
    return (
      this.dataState.currentFilter.from !== undefined &&
      this.dataState.currentFilter.to !== undefined &&
      this.dataState.currentFilter.from.getMonth() === this.dataState.currentFilter.to.getMonth() && this.dataState.currentFilter.from.getFullYear() === this.dataState.currentFilter.to.getFullYear()
    );
  }
  isSelectedMonth(date: DateFilter): boolean {
    if (!this.dataState.currentFilter.from || !this.dataState.currentFilter.to) {
      return false;
    }

    return (
      this.dataState.currentFilter.from.getTime() === date.from.getTime() &&
      this.dataState.currentFilter.to.getTime() === date.to.getTime()
    );
  }

  refreshPage(){
    this.cds.detectChanges();
  }
}
