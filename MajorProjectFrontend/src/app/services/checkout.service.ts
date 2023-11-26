import { PaymentInfo } from './../common/payment-info';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable, of } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = environment.serverUrl + '/checkout/purchase';
  private authTokenKey = 'auth_token';
  private paymentIntentUrl = environment.serverUrl + "/checkout/payment-intent";

  constructor(private httpClient: HttpClient) {
    axios.defaults.baseURL = environment.baseUrl;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return !!token;
  }

  getAuthToken(): string | null {
    return window.sessionStorage.getItem(this.authTokenKey);
  }

  setAuthToken(token: string | null): void {
    if (token !== null) {
      window.sessionStorage.setItem(this.authTokenKey, token);
    } else {
      window.sessionStorage.removeItem(this.authTokenKey);
    }
  }


  request(method: string, url: string, data: any): Promise<any> {
      let headers: any = {};

      if (this.getAuthToken() !== null) {
          headers = {"Authorization": "Bearer " + this.getAuthToken()};
      }

      return axios({
          method: method,
          url: url,
          data: data,
          headers: headers
      });
  }

  //payment intent for stripe
  createPaymentIntent(paymentInfo: PaymentInfo) : Observable<any>{
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }

}
function next(arg0: boolean): Observable<boolean> {
  throw new Error('Function not implemented.');
}

