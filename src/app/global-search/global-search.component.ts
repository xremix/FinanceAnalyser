import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataState } from '../services/data-state';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './global-search.component.html',
  styleUrl: './global-search.component.scss'
})
export class GlobalSearchComponent implements OnDestroy {
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(public dataState: DataState) {
    this.searchTerm = this.dataState.currentFilter.searchTerm;
    
    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.dataState.filterBySearchTerm(searchTerm);
    });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}
