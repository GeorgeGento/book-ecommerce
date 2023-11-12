import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { DataViewModule } from 'primeng/dataview';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { BadgeModule } from 'primeng/badge';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthService } from './services/auth/auth.service';
import { UsersComponent } from './pages/adminDashboard/users/users.component';
import { BooksComponent } from './pages/adminDashboard/books/books.component';
import { CartService } from './services/cart/cart.service';
import { UserService } from './services/user/user.service';
import { AddEditUserModalComponent } from './pages/adminDashboard/users/components/add-edit-user-modal/add-edit-user-modal.component';
import { AdminNavbarComponent } from './pages/adminDashboard/components/admin-navbar/admin-navbar.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AddEditBookModalComponent } from './pages/adminDashboard/books/components/add-edit-book-modal/add-edit-book-modal.component';
import { BookService } from './services/book/book.service';
import { CartDialogListComponent } from './components/cart-dialog-list/cart-dialog-list.component';
import { CategoriesFilterComponent } from './components/categories-filter/categories-filter.component';
import { OrderService } from './services/order/order.service';
import { OrdersComponent } from './pages/adminDashboard/orders/orders.component';
import { AddEditOrderModalComponent } from './pages/adminDashboard/orders/components/add-edit-order-modal/add-edit-order-modal.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ThemeService } from './services/theme/theme.service';
import { ThemeToggleButtonComponent } from './components/theme-toggle-button/theme-toggle-button.component';
import { PaypalButtonsComponent } from './components/paypal-buttons/paypal-buttons.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { UserOrdersComponent } from './pages/user/orders/orders.component';
import { OrderIdComponent } from './pages/order-id/order-id.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UsersComponent,
    BooksComponent,
    AddEditUserModalComponent,
    AdminNavbarComponent,
    AddEditBookModalComponent,
    CartDialogListComponent,
    CategoriesFilterComponent,
    OrdersComponent,
    AddEditOrderModalComponent,
    CheckoutComponent,
    ThemeToggleButtonComponent,
    PaypalButtonsComponent,
    ProfileComponent,
    UserOrdersComponent,
    OrderIdComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ButtonModule,
    CardModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastModule,
    ToolbarModule,
    SplitButtonModule,
    TableModule,
    DialogModule,
    InputNumberModule,
    ConfirmDialogModule,
    InputTextareaModule,
    DropdownModule,
    FileUploadModule,
    DataViewModule,
    DynamicDialogModule,
    BadgeModule,
    ToggleButtonModule,
  ],
  providers: [
    MessageService,
    CookieService,
    AuthService,
    CartService,
    UserService,
    BookService,
    OrderService,
    ConfirmationService,
    DialogService,
    ThemeService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
