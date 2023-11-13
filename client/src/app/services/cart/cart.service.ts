import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../../types/cart';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CartDialogListComponent } from '../../components/cart-dialog-list/cart-dialog-list.component';
import { PaypalButtonsComponent } from 'src/app/components/paypal-buttons/paypal-buttons.component';
import { BookService } from '../book/book.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: [] });
  cartDialogRef: DynamicDialogRef | undefined;
  checkoutDialogRef: DynamicDialogRef | undefined;

  constructor(
    private messageService: MessageService,
    private cookieService: CookieService,
    private dialogService: DialogService,
    private bookService: BookService
  ) {
    const cookieCart = this.getCartFromCookie();
    if (cookieCart) {
      this.cart.next(cookieCart);
    }
  }

  showCheckoutDialog() {
    this.checkoutDialogRef = this.dialogService.open(PaypalButtonsComponent, {
      header: 'Checkout',
      width: '70%',
      contentStyle: {
        overflow: 'auto',
        // display: 'flex',
        // 'align-items': 'center',
        // 'justify-content': 'center',
      },
      baseZIndex: 10000,
      maximizable: false,
      closeOnEscape: true,
      dismissableMask: true,
    });
  }

  closeCheckoutDialog() {
    if (this.checkoutDialogRef) {
      this.checkoutDialogRef.close();
    }
  }

  destroyCheckoutDialog() {
    if (this.checkoutDialogRef) {
      this.checkoutDialogRef.destroy();
    }
  }

  showCartDialog() {
    this.cartDialogRef = this.dialogService.open(CartDialogListComponent, {
      header: 'Cart',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      closeOnEscape: true,
      dismissableMask: true,
    });
  }

  closeCardDialog() {
    if (this.cartDialogRef) {
      this.cartDialogRef.close();
    }
  }

  destroyCardDialog() {
    if (this.cartDialogRef) {
      this.cartDialogRef.destroy();
    }
  }

  addToCart(item: CartItem): void {
    this.bookService.getBook(item._id).subscribe((res) => {
      const items = [...this.cart.value.items];
      const itemInCart = items.find((_item) => _item._id === item._id);
      if (
        (itemInCart && res.stock < itemInCart.quantity + 1) ||
        res.stock < item.quantity
      )
        return this.messageService.add({
          severity: 'error',
          summary: 'Out Of Stock',
          detail: `${item.title} is out of stock.`,
        });

      if (itemInCart) itemInCart.quantity += 1;
      else items.push(item);

      this.cart.next({ items });
      this.saveCartToCookie();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `${item.title} added to cart.`,
      });
    });
  }

  getTotal(items: CartItem[]): number {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  clearCart(showMsg?: boolean): void {
    this.cart.next({ items: [] });
    this.deleteCookie();
    if (showMsg)
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Cart is cleared.',
      });
  }

  removeFromCart(item: CartItem): void {
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item._id !== item._id
    );

    this.cart.next({ items: filteredItems });
    this.saveCartToCookie();
    this.messageService.add({
      severity: 'error',
      summary: 'Success',
      detail: `${item.title} removed from cart.`,
    });
  }

  removeQuantity(item: CartItem): void {
    const selectedItem = this.cart.value.items.find(
      (_item) => _item._id === item._id
    );
    if (!selectedItem) return;

    selectedItem.quantity -= 1;
    if (selectedItem.quantity === 0) this.removeFromCart(selectedItem);
    this.saveCartToCookie();
  }

  saveCartToCookie() {
    this.cookieService.set('currentCart', JSON.stringify(this.cart.value), {
      secure: true,
      sameSite: 'Strict',
      path: '/',
      expires: 365,
    });
  }

  getCartFromCookie() {
    const tokenCookie = this.cookieService.get('currentCart');
    if (!tokenCookie) return null;

    return JSON.parse(tokenCookie);
  }

  deleteCookie() {
    this.cookieService.delete('currentCart', '/');
  }
}
