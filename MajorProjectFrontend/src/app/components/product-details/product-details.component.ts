import { CartService } from './../../services/cart.service';
import { ActivatedRoute, Route } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { Product } from 'src/app/common/product';
import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{

  product!: Product;

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=> {
      this.handleProductDetails();
    })
  }

  //search product based on id
  handleProductDetails() {
    //get id and convet it to number
    const productId: number = +this.route.snapshot.paramMap.get('id')!;

    this.ProductService.getProduct(productId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

  addToCart(){
    this.cartService.addToCart(new CartItem(this.product));
  }

  constructor(private ProductService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService){}

}
