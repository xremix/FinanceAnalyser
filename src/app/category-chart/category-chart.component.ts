import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApexChart, ApexLegend, NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { DataState } from '../services/data-state';
import { Category } from '../models/category';

@Component({
  selector: 'app-category-chart',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './category-chart.component.html',
  styleUrl: './category-chart.component.scss',
})
export class CategoryChartComponent implements OnChanges, OnInit {
  @Input() data: Category[] = [];
  @Output() triggerRefresh: EventEmitter<void> = new EventEmitter<void>();
  public chartOptions!: any;
  

  public labels: string[] = [];
  public series: number[] = [];

  private arraysAreEqual(array1: any[], array2: any[]): boolean {
    return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
  }

  private getCalculatedCategory(category: Category): { value: number; name: string } {
    const flatTransactions = [category.transactions, ...category.subCategories.map((c) => c.transactions)].flat();
    const activeTransactions = flatTransactions.filter((t) => this.dataState.showTransaction(t));
    const total = activeTransactions.reduce((acc, t) => acc + t.amount, 0);
    return {
      value: Math.abs(total | 0),
      name: category.name,
    };
  }

  private getFilteredCategoryData(): { value: number; name: string }[] {
    let x = this.data
      .filter((d) => d.total < 0)
      .map((d) => this.getCalculatedCategory(d))
      .sort((a, b) => a.value - b.value);
    return x;
  }

  private refresh() {
    // Filtern und Umwandeln der Daten in einem Schritt
    const filteredData = this.getFilteredCategoryData();

    const _series = filteredData.map((d) => d.value);
    if (this.arraysAreEqual(_series, this.series)) return;

    this.series = [..._series]; // Verwenden Sie Spread-Operator, um eine neue Referenz zu erstellen

    const _labels = filteredData.map((d) => d.name);
    if (this.arraysAreEqual(_labels, this.labels)) return;

    this.labels = [..._labels]; // Verwenden Sie Spread-Operator, um eine neue Referenz zu erstellen
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.refresh();
    }
  }

  constructor(private dataState: DataState) {
    const self = this;
    this.chartOptions = {
      legend: {
        position: 'bottom',
      } as ApexLegend,
      chart: {
        type: 'donut',
        events: {
          dataPointSelection: function (event, chartContext, config) {
            var ix = config.dataPointIndex;
            const label = config.w.config.labels[ix];
            const category = self.dataState.categories.find((c) => c.name === label);
            if (category) {
              self.dataState.filterByCategory(category);
            }
            
            self.triggerRefresh.emit();
          },
        },
      } as ApexChart,
    };
  }
  ngOnInit(): void {
    this.dataState.selectedTransactionsChanged.subscribe(() => {
      this.refresh();
    });
  }
}
