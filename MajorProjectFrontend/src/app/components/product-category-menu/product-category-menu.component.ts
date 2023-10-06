import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/classes/product-category';


@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit{

  //constructor injection to fetch object
  constructor(private productService: ProductService){}

  //executed after the constructor is initialised
  ngOnInit(): void {
    this.updateProductCategories();
  }

  //all the necessary instances
  productCategories: ProductCategory[] = [];

  //update the product categories once the ts class is instatised
  updateProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        this.productCategories = data;
        console.log(this.productCategories);
      },
      error => {
        console.error('Error fetching product categories:', error);
      }
    );
  }

}
