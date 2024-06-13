import { NgModule, Inject, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { ProductService } from './services/product.service';
import { Routes, RouterModule, Router, CanActivate } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
// Import statement in your component or module
import { DatePipe } from '@angular/common';
import { NgbModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { MembersComponent } from './components/members/members.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CheckoutGuard } from './gaurds/checkout.gaurd';
import { CommonModule } from '@angular/common';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { PiechartComponent } from './components/analytics/piechart/piechart.component';

//defining the routes
const routes: Routes = [
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [ CheckoutGuard ]},
  {path: 'login', component: LoginComponent},
  {path: 'members', component: MembersComponent, canActivate: [CheckoutGuard]},
  {path: 'checkout', component: CheckoutComponent, canActivate: [CheckoutGuard]},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: 'analytics', component: AnalyticsComponent},
  {path: '',  redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    LoginComponent,
    OrderHistoryComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CheckoutComponent,
    OrderHistoryComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    MembersComponent,
    NavbarComponent,
    AnalyticsComponent,
    AnalyticsComponent,
    PiechartComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbPagination,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DatePipe
  ],
  providers: [
    ProductService,
    CheckoutGuard,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
