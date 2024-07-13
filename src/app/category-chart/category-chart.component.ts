import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexStroke,
  ApexLegend,
  ChartComponent,
  NgApexchartsModule,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { DataState } from '../services/data-state';
import { CategorySummary } from '../models/category-summary';

@Component({
  selector: 'app-category-chart',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './category-chart.component.html',
  styleUrl: './category-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryChartComponent implements  OnChanges{

  @Input() data: CategorySummary[] = [];

  public chartOptions =  {
    chart: {
      type: "donut"
    } as ApexChart,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };
  
  public labels: string[] = [];
  public series: number[] = [];

  private arraysAreEqual(array1: any[], array2: any[]): boolean {
    return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
  }
  
  private refresh() {
      // Filtern und Umwandeln der Daten in einem Schritt
      const filteredData = this.data
          .filter((d) => d.value < 0)
          .map((d) => ({ ...d, value: Math.abs(d.value | 0) }))
          .sort((a, b) => a.value - b.value);
  
      const _series = filteredData.map((d) => d.value);
      if (this.arraysAreEqual(_series, this.series)) return;
  
      this.series = [..._series]; // Verwenden Sie Spread-Operator, um eine neue Referenz zu erstellen
  
      const _labels = filteredData.map((d) => d.category);
      if (this.arraysAreEqual(_labels, this.labels)) return;
  
      this.labels = [..._labels]; // Verwenden Sie Spread-Operator, um eine neue Referenz zu erstellen
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"]) {
      this.refresh();
    }
  }

   
}
