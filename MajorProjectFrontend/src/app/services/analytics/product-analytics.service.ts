import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductAnalyticsService {

  constructor(private httpClient: HttpClient) { }

  private url: string = environment.serverUrl + '/analytics/get-categories';

  findProductCategoryForAnalytics(email: string | null) {
    console.log(`${this.url}?customerMail=${email?.trim()}`);
    return this.httpClient.get<Map<string, number>>(this.url + '?customerMail=' + email?.trim());
  }
}
