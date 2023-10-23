import { CheckoutService } from './../../services/checkout.service';
import { Country } from './../../common/country';
import { ShopFormService } from './../../services/shop-form.service';
import { Component, NgZone, OnInit, numberAttribute } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupName,
  Validators,
} from '@angular/forms';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CustomValidators } from 'src/app/validators/custom-validators';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkOutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  cache: Storage = sessionStorage;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private shopFormService: ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    public modalService: NgbModal,
    private ngZone: NgZone
  ) {
    // Checking authentication status synchronously
    const isAuthenticated = this.checkoutService.isAuthenticated();

    if (!isAuthenticated) {
      // Navigate to login if not authenticated
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    const theEmail = JSON.parse(this.cache.getItem('userEmail')!);

    this.reviewCartDetails();

    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          CustomValidators.notOnlyWhiteSpace,
        ]),
        email: new FormControl(theEmail, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          CustomValidators.notOnlyWhiteSpace,
        ]),
        city: new FormControl('', [
          Validators.required,
          CustomValidators.notOnlyWhiteSpace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          CustomValidators.notOnlyWhiteSpace,
        ]),
      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          CustomValidators.notOnlyWhiteSpace,
        ]),
        city: new FormControl('', [
          Validators.required,
          CustomValidators.notOnlyWhiteSpace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          CustomValidators.notOnlyWhiteSpace,
        ]),
      }),

      Payment: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        name: new FormControl('', [
          Validators.required,
          CustomValidators.notOnlyWhiteSpace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1;

    this.shopFormService.getCreditCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });

    //populate credit card years
    this.shopFormService.getCreditCardYears().subscribe((data) => {
      this.creditCardYears = data;
    });

    //populate countries
    this.shopFormService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  //subscribe the total price and details from cart service
  reviewCartDetails() {
    //subscribe the cartservice quantity
    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );

    //subscribe the price
    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));
  }

  onSubmit() {
    if (this.checkOutFormGroup.invalid) {
      this.checkOutFormGroup.markAllAsTouched();
      return;
    }

    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItem = this.cartService.cartItems;

    //create order items for cart items
    // let orderItems: OrderItem[] = [];
    // for(let i=0;i<cartItem.length;i++){
    //   orderItems[i] = new OrderItem(cartItem[i]);
    // }
    let orderItems: OrderItem[] = cartItem.map((item) => new OrderItem(item));

    //set up purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkOutFormGroup.controls['customer'].value;

    //populate purchase - shippping address
    purchase.shippingAddress =
      this.checkOutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase - billing address
    purchase.billingAddress =
      this.checkOutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = shippingState.name;
    purchase.billingAddress.country = shippingCountry.name;

    //populate order and order items
    purchase.order = order;
    purchase.orderItems = orderItems;

    this.checkoutService
      .request('POST', '/api/checkout/purchase', purchase)
      .then((response) => {
        console.log('Response received:', response);
        this.modalMessage = `Your order has been received \nOrder Tracking Number: ${response.data.orderTrackingNumber}`;
        this.resetCart();
      })
      .catch((error) => {
        console.log('Error occurred:', error);
        this.modalMessage = `There was an error ${error.message}`;
        this.openModal();
      });
  }

  resetCart() {
    //reset cart
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.storage.setItem(
      'cartItems',
      JSON.stringify(this.cartService.cartItems)
    );

    //reset form
    this.checkOutFormGroup.reset();

    //navigate
    this.openModal();
  }

  copyShippingAddress(event: any) {
    if (event.target.checked) {
      this.checkOutFormGroup.controls['billingAddress'].setValue(
        this.checkOutFormGroup.controls['shippingAddress'].value
      );
      console.log('im in auto filler');

      //bug fix for shipping address and billing address
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkOutFormGroup.controls['billingAddress'].reset();

      //bug fix
      this.billingAddressStates = [];
    }
  }

  hadleMonthAndYears() {
    const creditCardFormGroup = this.checkOutFormGroup.get('Payment');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup?.value.expirationYear
    );

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });
  }

  getStates(formName: string) {
    const formGroup = this.checkOutFormGroup.get(formName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    this.shopFormService.getStates(countryCode).subscribe((data) => {
      if (formName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else this.billingAddressStates = data;

      //select first item as default
      formGroup?.get('state')?.setValue(data[0]);
    });
    console.log('im getting states');
  }

  get firstName() {
    return this.checkOutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkOutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkOutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkOutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkOutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkOutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressCountry() {
    return this.checkOutFormGroup.get('shippingAddress.country');
  }
  get shippingAddressZipCode() {
    return this.checkOutFormGroup.get('shippingAddress.zipCode');
  }

  get billingAddressStreet() {
    return this.checkOutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkOutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkOutFormGroup.get('billingAddress.state');
  }
  get billingAddressCountry() {
    return this.checkOutFormGroup.get('billingAddress.country');
  }
  get billingAddressZipCode() {
    return this.checkOutFormGroup.get('billingAddress.zipCode');
  }

  get cardType() {
    return this.checkOutFormGroup.get('Payment.cardType');
  }
  get name() {
    return this.checkOutFormGroup.get('Payment.name');
  }
  get cardNumber() {
    return this.checkOutFormGroup.get('Payment.cardNumber');
  }
  get securityCode() {
    return this.checkOutFormGroup.get('Payment.securityCode');
  }

  modalMessage: string = '';
  showModal: boolean = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.router.navigate(['/products']);
  }
}
