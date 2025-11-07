import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexYAxis,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexStroke,
  ApexLegend,
  ChartComponent,
  NgApexchartsModule,
  ApexTitleSubtitle,
  ApexMarkers,
} from 'ng-apexcharts';
import { Transaction } from '../models/transaction';
import { CommonModule } from '@angular/common';
import { DataState } from '../services/data-state';

@Component({
  selector: 'app-daily-income-expense-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './daily-income-expense-chart.component.html',
  styleUrl: './daily-income-expense-chart.component.scss',
})
export class DailyIncomeExpenseChartComponent implements OnInit, OnChanges {
  @Input() transactions: Transaction[] = [];
  @Output() triggerRefresh: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: ChartOptions;
  public isCollapsed = true;

  public categories: ApexXAxis = {
    categories: [],
  };
  
  public series: ApexAxisChartSeries = [
    {
      name: 'Einnahmen',
      data: [],
    },
    {
      name: 'Ausgaben', 
      data: [],
    },
  ];

  private refresh() {
    if (this.transactions.length === 0) return;

    // Get all unique dates from transactions and sort them
    const uniqueDates = [...new Set(this.transactions.map(t => t.bookingDate.toDateString()))]
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // Create categories for x-axis (formatted dates)
    this.categories.categories = uniqueDates.map(dateStr => 
      new Date(dateStr).toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: '2-digit' 
      })
    );

    // Calculate daily income
    const dailyIncome = uniqueDates.map(dateStr => {
      const date = new Date(dateStr);
      return this.transactions
        .filter(t => t.bookingDate.toDateString() === dateStr && t.amount >= 0)
        .reduce((sum, t) => sum + t.amount, 0);
    });

    // Calculate daily expenses (positive values for display)
    const dailyExpenses = uniqueDates.map(dateStr => {
      const date = new Date(dateStr);
      return this.transactions
        .filter(t => t.bookingDate.toDateString() === dateStr && t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    });

    this.series = [
      {
        name: 'Einnahmen',
        data: dailyIncome,
        color: '#54E7A7',
      },
      {
        name: 'Ausgaben',
        data: dailyExpenses,
        color: '#E75454',
      }
    ];

    this.chartOptions.xaxis = this.categories;
    
    // Force chart update if visible and chart exists
    if (!this.isCollapsed && this.chart) {
      setTimeout(() => {
        this.chart.updateSeries(this.series);
      }, 50);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions']) {
      this.refresh();
    }
  }

  ngOnInit(): void {
    // Initial refresh handled by ngOnChanges
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    
    // Force chart to re-render when expanded
    if (!this.isCollapsed) {
      setTimeout(() => {
        if (this.chart) {
          this.chart.updateOptions({
            chart: {
              ...this.chartOptions.chart
            }
          });
        }
      }, 100);
    }
  }

  constructor(private dataState: DataState, private cdr: ChangeDetectorRef) {
    const self = this;
    this.chartOptions = {
      legend: {
        position: 'top',
      },
      title: {
        text: 'Tägliche Ein- und Ausgaben',
      },
      chart: {
        type: 'line',
        height: 350,
        zoom: {
          enabled: true,
          type: 'x',
        },
        toolbar: {
          show: true,
        },
        events: {
          dataPointSelection: function (event, chartContext, config) {
            // Optional: Add click functionality if needed
            self.triggerRefresh.emit();
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 3,
        curve: 'smooth',
      },
      markers: {
        size: 4,
        strokeWidth: 2,
        hover: {
          size: 6,
        },
      },
      xaxis: {
        categories: [],
        title: {
          text: 'Datum',
        },
      },
      yaxis: {
        title: {
          text: 'Betrag (€)',
        },
        labels: {
          formatter: function (val) {
            return '€' + val.toFixed(2);
          },
        },
        decimalsInFloat: 2,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return '€' + val.toFixed(2);
          },
        },
        x: {
          show: true,
        },
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
    };
  }
}

export type ChartOptions = {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  grid: any;
};