import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineIncomeComponentComponent } from './line-income-component.component';

describe('LineIncomeComponentComponent', () => {
  let component: LineIncomeComponentComponent;
  let fixture: ComponentFixture<LineIncomeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineIncomeComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineIncomeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
