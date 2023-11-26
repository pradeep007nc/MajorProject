import { CheckoutService } from 'src/app/services/checkout.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private auth: CheckoutService) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }


  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const theEndpoint = environment.serverUrl + '/orders'
    const securedEndpoints = [theEndpoint];

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
