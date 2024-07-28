import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbCalendar, NgbDateParserFormatter, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DataState } from '../services/data-state';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss'
})
export class DateRangePickerComponent implements OnInit, OnChanges {
	calendar = inject(NgbCalendar);
	formatter = inject(NgbDateParserFormatter);

	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null = this.calendar.getToday();
	toDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 10);

  @Input() public from: Date = new Date();
  @Input() public to: Date = new Date();

  constructor(private dataState: DataState) {}

  ngOnInit(): void {
    this.fromDate = this.dateToNgbDate(this.from);
    this.toDate = this.dateToNgbDate(this.to);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["from"]) {
      const date = this.dateToNgbDate(this.from);
      if(!this.fromDate || !this.fromDate.equals(date)){
        this.fromDate = date;
      }
    }
    if (changes["to"]) {
      const date = this.dateToNgbDate(this.to);
      if(!this.toDate || !this.toDate.equals(date)){
        this.toDate = date;
      }
    }
  
  }

	onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.dataState.filterByRange(this.ngbDateToDate(this.fromDate),  this.ngbDateToDate(this.toDate));
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

  private ngbDateToDate(date: NgbDate): Date {
    return new Date(date.year, date.month - 1, date.day);
  }

  private dateToNgbDate(date: Date): NgbDate {
    return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }
	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}
}
