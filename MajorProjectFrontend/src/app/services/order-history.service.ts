import { Order } from './../common/order';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment.development';
import { OrderItem } from '../common/order-item';


@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.serverUrl+"/orders";

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {

    // need to build URL based on the customer email
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;

    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }

  getOrderItemByCustomerEmail(theEmail: string): Observable<GetResponseOrderItemsByCustomer>{
       // need to build URL based on the customer email
       const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;
       return this.httpClient.get<GetResponseOrderItemsByCustomer>(orderHistoryUrl);
  }

}

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  }
}

interface GetResponseOrderItemsByCustomer{
  _embedded:{
    orders: order[];
  }
}

interface order{
  orderItems: OrderItem;
}

