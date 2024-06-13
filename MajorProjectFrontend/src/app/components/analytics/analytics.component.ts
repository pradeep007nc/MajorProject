import { Chart, ChartConfiguration } from 'chart.js';
import { environment } from './../../../environments/environment';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OrderItem } from 'src/app/common/order-item';
import { ProductAnalyticsService } from 'src/app/services/analytics/product-analytics.service';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, OnChanges {

  constructor(private analyticsService: ProductAnalyticsService) {}
  ngOnChanges(changes: SimpleChanges): void {
  }


  categoryDataPieChart!: Map<string, number>;
  storage: Storage = sessionStorage;

  ngOnInit(): void {
    this.getOrderItemsByCustomer();
  }



  private getOrderItemsByCustomer() {
    const email: string = this.storage.getItem('userEmail')!.trim().replace(/"/g, '');
    this.analyticsService.findProductCategoryForAnalytics(email)
      .subscribe(
        (data: Map<string, number>) => {
          this.categoryDataPieChart = data;
        },
        (error) => {
          console.error('Error fetching category data:', error);
        }
      );
  }

  clickCheck(){
    console.log(this.categoryDataPieChart)
  }

}
