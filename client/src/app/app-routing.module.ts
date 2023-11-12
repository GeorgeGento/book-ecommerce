import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/adminDashboard/users/users.component';
import { BooksComponent } from './pages/adminDashboard/books/books.component';
import { OrdersComponent } from './pages/adminDashboard/orders/orders.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { UserOrdersComponent } from './pages/user/orders/orders.component';
import { OrderIdComponent } from './pages/order-id/order-id.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  {
    path: 'users/:userId/profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users/:userId/orders',
    component: UserOrdersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users/:userId/orders/:orderId',
    component: OrderIdComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/dashboard/users',
    component: UsersComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/dashboard/books',
    component: BooksComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/dashboard/orders',
    component: OrdersComponent,
    canActivate: [AdminGuard],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
