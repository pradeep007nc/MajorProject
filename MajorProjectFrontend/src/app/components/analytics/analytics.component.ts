import { Component, OnInit } from '@angular/core';
import { OrderItem } from 'src/app/common/order-item';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  orderItems: OrderItem[] = [];

  constructor(private orderHistoryService: OrderHistoryService) {}

  storage: Storage = sessionStorage;

  ngOnInit(): void {
    this.getOrderItemsByCustomer();
  }



  private getOrderItemsByCustomer() {
    const email: string = this.storage.getItem('userEmail')!;
    this.orderItems = [];

    this.orderHistoryService.getOrderItemByCustomerEmail(email).subscribe(
      data => {
        if (data._embedded && data._embedded.orders) {
          // Flatten the array of orderItems from each order
          this.orderItems = data._embedded.orders
            .map(order => order.orderItems)
            .flat();

          // Log the order items
          console.log('Order Items:', this.orderItems);
        } else {
          console.log('No orders found for the customer');
        }
      },
      error => {
        console.error("Error fetching order items:", error);
      }
    );
  }

  clickCheck() {
    console.log('Clicked! Order Items:', this.orderItems);
  }
}
