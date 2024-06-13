import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PiechartComponent implements OnInit, OnChanges {
  constructor() {}

  @Input('categoryData') data!: Map<string, number>;

  myChart!: Chart;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      // Convert the data to a Map if it's not already a Map
      if (!(this.data instanceof Map)) {
        this.data = new Map(Object.entries(changes['data'].currentValue));
      }

      if (this.myChart) {
        this.myChart.destroy();
      }
      this.RenderPieChart();
    }
  }

  ngOnInit(): void {
    Chart.register(...registerables);  // Register all necessary components
  }

  RenderPieChart(): void {
    const canvas = document.getElementById('piechart') as HTMLCanvasElement;

    const data = {
      labels: Array.from(this.data.keys()),
      datasets: [
        {
          label: 'My First Dataset',
          data: Array.from(this.data.values()),
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          hoverOffset: 4,
        },
      ],
    };

    const options = {
      responsive: true, // Make the chart responsive
      maintainAspectRatio: true, // Allow chart to adjust size while maintaining aspect ratio
    };

    const config: ChartConfiguration = {
      type: 'pie',
      data,
      options: options
    };

    // Create the chart
    this.myChart = new Chart(canvas, config);
  }
}
