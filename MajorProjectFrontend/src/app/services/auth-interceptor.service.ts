import { CheckoutService } from 'src/app/services/checkout.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private auth: CheckoutService) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }


  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const securedEndpoints = ['http://localhost:8080/api/orders'];

    //if it match get access token
    if(securedEndpoints.some(url => request.urlWithParams.includes(url))){
      const accessToken = this.auth.getAuthToken();

      //clone request and add new header
      //request are immutable
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer' + accessToken
        }
      })
    }

    return await lastValueFrom(next.handle(request));
  }
}
