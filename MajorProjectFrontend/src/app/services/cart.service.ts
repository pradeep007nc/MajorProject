import { CartItem } from './../common/cart-item';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  //subject is the subclass of observable
  //we can use subject to publish events in our code
  //the events can be sent to all the subscribers
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);

  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  //reference to the web browser session storge object
  // storage: Storage = sessionStorage;
  storage: Storage = localStorage;

  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if(data != null){
      this.cartItems = data;

      //compute total based on data in storage
      this.computeCartTotal();
    }
   }

  addToCart(theCartItem: CartItem) {

    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id

      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id )!;

      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      // increment the quantity
      existingCartItem.quantity++;
    }
    else {
      // just add the item to the array
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotal();
  }


  computeCartTotal() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the value so that subscribers get the value
    //.next is going to publish and send the event
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    // this.logCartData(totalPriceValue, totalQuantityValue);

    this.persistCartItems();
  }

  persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartData(totalPrice: number, totalQuantity: number) {
    console.log('contents of the cart');

    for(let item of this.cartItems){
      const subTotal: number = item.quantity * item.unitPrice;
      console.log(`name: ${item.name}, quantity=${item.quantity}, price=${item.unitPrice}`);
    }

    console.log(`total price: ${totalPrice.toFixed(2)}, totalvalue: ${totalQuantity}`)
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if(cartItem.quantity === 0){
      this.remove(cartItem);
    }else{
      this.computeCartTotal();
    }
  }


  remove(cartItem: CartItem) {
    //get index of the item
    const tempIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id == cartItem.id );

    //if found, remove the item from the array
    if(tempIndex > -1){
      this.cartItems.splice(tempIndex, 1);

      this.computeCartTotal();
    }
  }


}


