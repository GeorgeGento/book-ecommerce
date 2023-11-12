import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { Cart, CartItem } from 'src/app/types/cart';

@Component({
  selector: 'app-cart-dialog-list',
  templateUrl: './cart-dialog-list.component.html',
})
export class CartDialogListComponent implements OnInit {
  cart: Cart = { items: [] };

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cartService.cart.subscribe({
      next: (_cart) => {
        this.cart = _cart;
      },
    });
  }

  getTotal(items: CartItem[]) {
    return this.cartService.getTotal(items);
  }

  clearCart() {
    this.cartService.clearCart(true);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onCheckout() {
    if (!this.authService.isLoggedIn.value) {
      this.cartService.closeCardDialog();
      this.router.navigate(['/login']);
    } else {
      if (!this.cart.items.length) {
        this.messageService.add({
          severity: 'error',
          summary: 'Empty Cart',
          detail: `Cart is empty, cannot proceed to checkout.`,
        });
      } else {
        this.cartService.closeCardDialog();
        this.router.navigate(['/checkout']);
      }
    }
  }
}
