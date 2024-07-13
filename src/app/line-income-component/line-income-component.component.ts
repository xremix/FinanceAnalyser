import { Component, Input, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexXAxis, ApexFill, ApexTooltip, ApexStroke, ApexLegend, ChartComponent, NgApexchartsModule, ApexTitleSubtitle } from 'ng-apexcharts';
import { CategorySummary } from '../models/category-summary';
import { Transaction } from '../models/transaction';
import { CommonModule } from '@angular/common';
import { DateService } from '../services/date-service';

@Component({
  selector: 'app-line-income-component',
  standalone: true,
  imports: [
    NgApexchartsModule,
    CommonModule
  ],
  templateUrl: './line-income-component.component.html',
  styleUrl: './line-income-component.component.scss'
})
export class LineIncomeComponentComponent {
  @Input() dates: Date[] = [];
  @Input() transactions: Transaction[] = [];

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: ChartOptions;

  get series(): ApexAxisChartSeries {
    return [{
      name: "X",
      data: this.dates.map(d => {
        const sum = this.transactions
        // filter where is in month
          .filter(t => t.month === d)
          .map(t => {
            console.log(t)
            return t.amount
          })
          .reduce((acc, a) => acc + a, 0);
        return sum;
      })
    }];
  }

  get categories(): ApexXAxis {
    return {
      categories: this.dates.map(d => d.toDateString())
    };
  }

  constructor() {
    this.chartOptions = {
      legend: {
        position: "top"
      },
      title: {
        text: "Income Analysis"
      },
      series: [
        {
          name: "Net Profit",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
          name: "Revenue",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        },
        {
          name: "Free Cash Flow",
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct"
        ]
      },
      yaxis: {
        title: {
          text: "$ (thousands)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return "$ " + val + " thousands";
          }
        }
      }
    };
  }
}


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};