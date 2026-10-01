import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Category } from '../models/category';
import { Transaction } from '../models/transaction';
import { DataState } from '../services/data-state';
import { SpendingInsightComponent } from './spending-insight.component';

describe('SpendingInsightComponent', () => {
  let fixture: ComponentFixture<SpendingInsightComponent>;
  let transactions: Transaction[];
  let state: {
    allTransactions: readonly Transaction[];
    categories: Category[];
    selectedTransactionsChanged: EventEmitter<Transaction[]>;
    resetFilter: jasmine.Spy;
    filterByType: jasmine.Spy;
    filterByRange: jasmine.Spy;
    filterByCategory: jasmine.Spy;
  };

  const food: Category = {
    name: 'Essen gehen',
    type: 'expense',
    keywords: [],
    excludeKeywords: [],
    subCategories: [],
    total: 0,
    transactions: [],
  };
  const savings: Category = {
    name: 'Sparen',
    type: 'savings',
    keywords: [],
    excludeKeywords: [],
    subCategories: [],
    total: 0,
    transactions: [],
  };

  function transaction(date: string, amount: number, category: Category): Transaction {
    return {
      month: new Date(date),
      bookingDate: new Date(date),
      valueDate: new Date(date),
      payerReceiver: 'Test',
      bookingText: '',
      purpose: '',
      balance: 0,
      balanceCurrency: 'EUR',
      amount,
      amountCurrency: 'EUR',
      category,
      raw: '',
    };
  }

  beforeEach(async () => {
    transactions = [
      transaction('2026-01-04', -50, food),
      transaction('2026-02-04', -50, food),
      transaction('2026-03-04', -50, food),
      transaction('2026-04-04', -50, food),
      transaction('2026-05-04', -50, food),
      transaction('2026-06-03', -145, food),
      transaction('2026-06-04', -500, savings),
    ];
    state = {
      allTransactions: transactions,
      categories: [food, savings],
      selectedTransactionsChanged: new EventEmitter<Transaction[]>(),
      resetFilter: jasmine.createSpy('resetFilter'),
      filterByType: jasmine.createSpy('filterByType'),
      filterByRange: jasmine.createSpy('filterByRange'),
      filterByCategory: jasmine.createSpy('filterByCategory'),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [SpendingInsightComponent],
      providers: [{ provide: DataState, useValue: state }],
    }).compileComponents();

    fixture = TestBed.createComponent(SpendingInsightComponent);
    fixture.detectChanges();
  });

  it('explains a spending increase against matching month-to-date windows', () => {
    expect(fixture.componentInstance.insight?.status).toBe('higher');
    expect(fixture.componentInstance.insight?.current).toBe(145);
    expect(fixture.componentInstance.insight?.baseline).toBe(50);
    expect(fixture.componentInstance.insight?.change).toBe(95);
    expect(fixture.componentInstance.insight?.comparisonMonthCount).toBe(5);
    expect(fixture.componentInstance.insight?.contributors[0]).toEqual(jasmine.objectContaining({
      category: food,
      label: 'Essen gehen',
      change: 95,
    }));
    const details = fixture.nativeElement.querySelector('details') as HTMLDetailsElement;
    expect(details.open).toBeFalse();

    (details.querySelector('summary') as HTMLElement).click();
    fixture.detectChanges();

    expect(details.open).toBeTrue();
    expect(details.textContent).toContain('Essen gehen');
  });

  it('does not claim a comparison when there is no prior month', () => {
    transactions = [transaction('2026-06-03', -145, food)];
    state.allTransactions = transactions;
    state.selectedTransactionsChanged.emit(transactions);
    fixture.detectChanges();

    expect(fixture.componentInstance.insight?.status).toBe('insufficient');
    expect(fixture.nativeElement.textContent).toContain('Zu wenig Verlauf für Vergleich');
  });

  it('opens the contributing category in the matching month-to-date transaction list', () => {
    const openTransactions = jasmine.createSpy('openTransactions');
    fixture.componentInstance.openTransactions.subscribe(openTransactions);

    fixture.componentInstance.showTransactions(food);

    expect(state.resetFilter).toHaveBeenCalled();
    expect(state.filterByType).toHaveBeenCalledWith('all');
    expect(state.filterByRange).toHaveBeenCalledWith(
      fixture.componentInstance.insight?.periodStart,
      fixture.componentInstance.insight?.periodEnd
    );
    expect(state.filterByCategory).toHaveBeenCalledWith(food);
    expect(openTransactions).toHaveBeenCalled();
  });
});
