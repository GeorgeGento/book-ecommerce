import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/types/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Cart } from 'src/app/types/cart';
import { CartService } from 'src/app/services/cart/cart.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CartDialogListComponent } from '../cart-dialog-list/cart-dialog-list.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  itemsQuantity: number = 0;
  items: MenuItem[] | undefined;
  isLoggedIn: boolean = false;
  user: User | undefined;
  showNavbar: boolean = true;
  showCart: boolean = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.authService.user.subscribe((_user) => {
      this.user = _user;

      this.items = [
        {
          label: 'Profile',
          icon: 'pi pi-fw pi-user',
          command: () => this.router.navigate([`/users/${this.user?._id}/profile`]),
        },
        {
          label: 'Orders',
          icon: 'pi pi-fw pi-list',
          command: () => this.router.navigate([`/users/${this.user?._id}/orders`]),
        },
      ];
      this.user?.admin &&
        this.items.push({
          label: 'Dashboard',
          icon: 'pi pi-fw pi-server',
          command: () => this.router.navigate(['/admin/dashboard/users']),
        });
      this.items.push(
        { separator: true },
        {
          label: 'Logout',
          icon: 'pi pi-fw pi-power-off',
          command: () => {
            this.isLoggedIn = false;
            this.authService.logout();
          },
        }
      );
    });
    this.authService.isLoggedIn.subscribe((res) => (this.isLoggedIn = res));

    this.router.events.subscribe((_event) => {
      if (
        _event instanceof NavigationStart ||
        _event instanceof NavigationEnd
      ) {
        if (
          _event.url.startsWith('/login') ||
          _event.url.startsWith('/register')
        ) {
          this.showNavbar = false;
        } else {
          this.showNavbar = true;
        }
      }
    });

    this.cartService.cart.subscribe({
      next: (cart) => {
        this.itemsQuantity = cart.items
          .map((item) => item.quantity)
          .reduce((prev, current) => prev + current, 0);
      },
    });
  }

  showDialog() {
    this.cartService.showCartDialog();
  }

  ngOnDestroy() {
    this.cartService.destroyCardDialog();
  }
}
