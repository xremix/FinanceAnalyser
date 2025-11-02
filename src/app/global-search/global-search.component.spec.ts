import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GlobalSearchComponent } from './global-search.component';
import { DataState } from '../services/data-state';

describe('GlobalSearchComponent', () => {
  let component: GlobalSearchComponent;
  let fixture: ComponentFixture<GlobalSearchComponent>;
  let mockDataState: jasmine.SpyObj<DataState>;

  beforeEach(async () => {
    mockDataState = jasmine.createSpyObj('DataState', ['filterBySearchTerm'], {
      currentFilter: { searchTerm: '' }
    });

    await TestBed.configureTestingModule({
      imports: [GlobalSearchComponent, FormsModule],
      providers: [
        { provide: DataState, useValue: mockDataState }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlobalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call filterBySearchTerm when search changes', () => {
    component.searchTerm = 'miete';
    component.onSearchChange();
    
    expect(mockDataState.filterBySearchTerm).toHaveBeenCalledWith('miete');
  });

  it('should clear search term and call filter with empty string', () => {
    component.searchTerm = 'miete';
    component.clearSearch();
    
    expect(component.searchTerm).toBe('');
    expect(mockDataState.filterBySearchTerm).toHaveBeenCalledWith('');
  });
});