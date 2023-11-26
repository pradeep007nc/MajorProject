import { Product } from './../common/product';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  theEndpoint = environment.baseUrl;
  private baseUrl = this.theEndpoint+'/api/products';
  private categoryUrl = this.theEndpoint+'/api/product-category';

  constructor(private httpClient: HttpClient) {
  }


  //pagination
  getProductListPaginate(thePage: number, pageSize: number,
    categoryId: number): Observable<GetResponseProduct> {

    //building url based on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
                    + `&page=${thePage}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getProductList(categoryId: number): Observable<Product[]> {

    //building url based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(searchData: string): Observable<Product[]>{
     //building url based on keyword
     const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${searchData}`;

     return this.getProducts(searchUrl);
  }

   //pagination search
   searchProductsPaginate(thePage: number, pageSize: number,
                          searchData: string): Observable<GetResponseProduct> {

    //building url based on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${searchData}`
                    + `&page=${thePage}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(productId: number): Observable<Product> {
      //build url based on product id
      const productUrl = `${this.baseUrl}/${productId}`;

      return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponseProduct{
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[];
  }
}


