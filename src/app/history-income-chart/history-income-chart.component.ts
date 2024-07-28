import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
import { Transaction } from '../models/transaction';
import { CommonModule } from '@angular/common';
import { DataState } from '../services/data-state';

@Component({
  selector: 'app-history-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './history-income-chart.component.html',
  styleUrl: './history-income-chart.component.scss',
})
export class HistoryIncomeChartComponent implements OnInit, OnChanges {
  @Input() dates: Date[] = [];
  @Input() transactions: Transaction[] = [];
  @Output() triggerRefresh: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: ChartOptions;

  public categories: ApexXAxis = {
    categories: [],
  };
  public series: ApexAxisChartSeries = [
    {
      name: 'X',
      data: [],
    },
  ];


  private refresh() {
    this.categories.categories = this.dates.map((d) => d.toLocaleDateString());
    if (this.dates.length === 0) return;

    this.series = [
      {
        name: 'Einnahmen',
        // takes the dates and filters the transactions for the month
        data: this.dates.map((d) => {
          return (
            this.transactions
              .filter(
                (t) => t.bookingDate.getMonth() === d.getMonth() && t.bookingDate.getFullYear() === d.getFullYear()
              )
              // only negative transactions
              .filter((t) => t.amount >= 0)
              .reduce((acc, t) => acc + (t.amount | 0), 0)
          );
        }),
        color: '#54E7A7',
      },
      {
        name: 'Ausgabe',
        // takes the dates and filters the transactions for the month
        data: this.dates.map((d) => {
          return (
            this.transactions
              .filter(
                (t) => t.bookingDate.getMonth() === d.getMonth() && t.bookingDate.getFullYear() === d.getFullYear()
              )
              // only negative transactions
              .filter((t) => t.amount < 0)
              .reduce((acc, t) => acc + ((t.amount * -1) | 0), 0)
          );
        }),
        color: '#E75454',
      },
     
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dates'] || changes['transactions']) {
      this.refresh();
    }
  }

  ngOnInit(): void {
    // this.refresh();
    // this.dataState.transactionsChanged.subscribe((transactions) => {
    //   this.transactions = transactions;
    //   this.refresh();
    // });
  }

  constructor(private dataState: DataState) {
    const self = this;
    this.chartOptions = {
      legend: {
        position: 'top',
      },
      title: {
        text: 'Einkommen / Ausgaben',
      },
      chart: {
        type: 'bar',
        height: 350,
        events: {
          dataPointSelection: function (event, chartContext, config) {
            var ix = config.dataPointIndex;
            self.dataState.filterByDay(self.dates[ix]);
            self.triggerRefresh.emit();
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      },
      yaxis: {
        title: {
          text: '$ (thousands)',
        },
        labels: {
          formatter: function (val, index) {
            return val.toFixed(2);
          },
        },
        decimalsInFloat: 2,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return '$ ' + val + ' thousands';
          },
        },
      },
    };
  }
}

export type ChartOptions = {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};
