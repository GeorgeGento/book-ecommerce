import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/services/cart/cart.service';
import { Cart, CartItem } from 'src/app/types/cart';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  cart: Cart = { items: [] };

  constructor(
    private cartService: CartService,
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

  showCheckout() {
    if (!this.cart.items.length)
      return this.messageService.add({
        severity: 'error',
        summary: 'Empty Cart',
        detail: 'Cart is empty cannot proceed to checkout.',
      });
    this.cartService.showCheckoutDialog();
  }
}
