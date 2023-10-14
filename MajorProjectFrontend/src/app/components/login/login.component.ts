import { CartService } from './../../services/cart.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private axiosService: CheckoutService,
              private router: Router){}

  @Output() onSubmitLoginEvent = new EventEmitter();
  @Output() onSubmitRegisterEvent = new EventEmitter();

  active: string = 'login';
  firstName: string = '';
  lastName: string = '';
  login: string = '';
  password: string = '';

  onTabLogin() {
    this.active = 'login';
  }

  onTabRegister() {
    this.active = 'register';
  }

  onSubmitLogin(): void {
    this.axiosService.request(
      "POST",
      "/login",
      {
        login: this.login,
        password: this.password
      }
    ).then(response => {
      this.axiosService.setAuthToken(response.data.token);
      this.router.navigate(['/products'])
    }).catch(error => {
            this.axiosService.setAuthToken(null);
            window.alert("wrong password try again");
    })
  }

  onSubmitRegister() {
    this.axiosService.request(
      "POST",
      "/register",
      {
        firstName: this.firstName,
        lastName: this.lastName,
        login: this.login,
        password: this.password
      }
    ).then(response => {
      this.axiosService.setAuthToken(response.data.token);
      this.router.navigate(['/products'])
    }).catch(error => {
            this.axiosService.setAuthToken(null);
            window.alert("wrong password try again");
    })
  }
}
