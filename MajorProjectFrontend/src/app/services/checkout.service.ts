import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable, of } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = "https://localhost:8443/api" + '/checkout/purchase';
  private authTokenKey = 'auth_token';

  constructor() {
    axios.defaults.baseURL = 'https://localhost:8443';
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

}
function next(arg0: boolean): Observable<boolean> {
  throw new Error('Function not implemented.');
}

