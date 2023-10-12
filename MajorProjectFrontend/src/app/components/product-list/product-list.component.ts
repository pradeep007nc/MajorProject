import { CartService } from './../../services/cart.service';
import { CartItem } from 'src/app/common/cart-item';
import { ActivatedRoute, Route } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{

  searchMode: boolean = false;
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;

  //new properties for pagination
  thePageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;


  previousKeyword!: string;

  //activated route
  constructor(private productService: ProductService,
            private cartService: CartService,
            private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }


  //check if id is avaiable
  //route use actived route
  //snapshot state of route at given moment of time
  //paramMap is map of all route param
  listProducts(){
      this.searchMode = this.route.snapshot.paramMap.has('keyword');

      if(this.searchMode){
        this.handleSearchProducts();
      }else{
        this.handleListProducts();
      }
  }

  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    //if we have different keyword than previous then we set the page number to 1
    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;

    }

    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword} pagenumber=${this.thePageNumber}`)

    // now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber-1,
                                                this.pageSize,
                                                theKeyword).subscribe(this.processResult());
  }

  handleListProducts() {

    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    //
    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed
    //

    // if we have a different category id than previous
    // then set thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;



    // now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                               this.pageSize,
                                               this.currentCategoryId)
                                               .subscribe(
                                                data => {
                                                  this.products = data._embedded.products;
                                                  this.thePageNumber = data.page.number + 1;
                                                  this.pageSize = data.page.size;
                                                  this.totalElements = data.page.totalElements;
                                                }
                                               );
  }

   //method for page size change
   updatePageSize(pageNumber: string){
    this.thePageNumber = 1;
    this.pageSize = +pageNumber;
    this.listProducts()
  }


  //data is passed to preduct service and this data is processed
  //and based on this metadata results are fetched
  processResult(){
    return(data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number+1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }


  addToCart(product: Product){
      const cartItem = new CartItem(product);

      this.cartService.addToCart(cartItem);

    }
}
