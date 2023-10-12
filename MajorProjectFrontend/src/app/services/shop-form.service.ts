import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../common/country';
import {map} from 'rxjs/operators'
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private countriesUrl = "http://localhost:8080/api/countries";
  private stateUrl = "http://localhost:8080/api/states";

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]>{
    let data: number[] = [];

    for(let theMonth=startMonth;theMonth<=12;theMonth++){
      data.push(theMonth);
    }

    return of(data);
   }

   getCreditCardYears(): Observable<number[]>{

    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear+10;

    for(let year = startYear; year<=endYear; year++){
      data.push(year);
    }

    return of(data);
   }

   getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
   }

   getStates(countryCode: string): Observable<State[]>{
    const serachUrl = `${this.stateUrl}/search/findByCountryCode?code=${countryCode}`;
      return this.httpClient.get<GetResponseStates>(serachUrl).pipe(
        map(response => response._embedded.states)
      );
   }
}


interface GetResponseCountries{
  _embedded:{
    countries: Country[];
  }
}


interface GetResponseStates{
  _embedded: {
    states: State[];
  }
}
