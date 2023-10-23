import { NgClass } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private axiosService: CheckoutService,
              private router: Router,
              public modalService: NgbModal){
              }

  @Output() onSubmitLoginEvent = new EventEmitter();
  @Output() onSubmitRegisterEvent = new EventEmitter();

  storage: Storage = sessionStorage;
  firstName: string = '';
  lastName: string = '';
  login: string = '';
  password: string = '';
  active: string = '';
  loginFailed: boolean = false;
  // modalRef: NgbModalRef | null = null;
  modalMessage: string = '';

  onTabLogin() {
    this.active = 'login';
    this.container = 'container';
  }

  onTabRegister() {
    this.active = 'register';
    this.container = 'container right-panel-active'
  }

  container = 'container';

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
      this.storage.setItem('userEmail', JSON.stringify(this.login));
    }).catch(error => {
            this.axiosService.setAuthToken(null);
            this.login = '';
            this.password = '';
            this.loginFailed = true;
            this.modalMessage =  error.response.data.message;;
            this.openModal();
    });
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
      this.router.navigate(['/products']);
      this.storage.setItem('userEmail', JSON.stringify(this.login));
    }).catch(error => {
        this.axiosService.setAuthToken(null);
    })
  }

  showModal: boolean = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }



}
