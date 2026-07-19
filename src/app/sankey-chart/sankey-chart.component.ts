import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { Category } from '../models/category';
import { Transaction } from '../models/transaction';
import { SankeyDataService } from '../services/sankey-data.service';

@Component({
  selector: 'app-sankey-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  providers: [provideEcharts()],
  templateUrl: './sankey-chart.component.html',
  styleUrls: ['./sankey-chart.component.scss']
})
export class SankeyChartComponent implements OnInit, OnChanges {
  @Input() transactions: Transaction[] = [];
  @Input() categories: Category[] = [];
  @Input() type: 'expense' | 'income' = 'expense';
  @Input() height = '600px';

  chartOptions: EChartsOption = {};

  constructor(private sankeyDataService: SankeyDataService) {}

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions'] || changes['categories'] || changes['type']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    const sankeyData = this.sankeyDataService.transformTransactionsToSankeyData(
      this.transactions,
      this.categories,
      this.type
    );

    if (sankeyData.nodes.length === 0) {
      this.chartOptions = {};
      return;
    }

    // Farbpalette für das Chart
    const colors = [
      '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
      '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#48b8d0',
      '#ff9f7f', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
      '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0'
    ];

    this.chartOptions = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: (params: any) => {
          if (params.dataType === 'edge') {
            return `${params.data.source} → ${params.data.target}<br/>
                    <strong>${this.sankeyDataService.formatCurrency(params.data.value)}</strong>`;
          }
          return `<strong>${params.name}</strong>`;
        }
      },
      series: [
        {
          type: 'sankey',
          emphasis: {
            focus: 'adjacency'
          },
          nodeAlign: 'left',
          orient: 'horizontal',
          draggable: true,
          data: sankeyData.nodes.map((node, index) => ({
            name: node.name,
            itemStyle: {
              color: colors[index % colors.length]
            }
          })),
          links: sankeyData.links,
          lineStyle: {
            color: 'gradient',
            curveness: 0.5
          },
          label: {
            position: 'right',
            formatter: (params: any) => {
              // Finde den Gesamtwert für diesen Node
              const nodeValue = sankeyData.links
                .filter(link => link.source === params.name || link.target === params.name)
                .reduce((sum, link) => {
                  if (link.target === params.name) return sum + link.value;
                  return sum;
                }, 0);
              
              if (nodeValue > 0) {
                return `${params.name}\n${this.sankeyDataService.formatCurrency(nodeValue)}`;
              }
              return params.name;
            },
            fontSize: 11,
            rich: {}
          },
          left: '5%',
          right: '20%',
          top: '5%',
          bottom: '5%'
        }
      ]
    };
  }
}
