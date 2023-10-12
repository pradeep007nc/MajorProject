import { CartService } from './../../services/cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit{
  totalprice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartService){}

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    //subscribe for cart total price
    this.cartService.totalPrice.subscribe(
      data => this.totalprice = data
    );

    //susbscribe for total quantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }


}
