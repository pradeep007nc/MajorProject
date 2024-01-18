import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from './../../services/order-history.service';
import { Component, OnInit } from '@angular/core';
// Import statement in your component or module
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit{

  orderHistory: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService){}

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory(){
    const Email = JSON.parse(this.storage.getItem('userEmail')!);

    console.log(Email);

    //retrieve the data from service
    this.orderHistoryService.getOrderHistory(Email).subscribe(
      data => {
        this.orderHistory = data._embedded.orders
      }
    );

  }

}
