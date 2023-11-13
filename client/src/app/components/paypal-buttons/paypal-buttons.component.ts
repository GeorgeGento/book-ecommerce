import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { CartItem } from 'src/app/types/cart';

declare var paypal: any;

@Component({
  selector: 'app-paypal-buttons',
  templateUrl: './paypal-buttons.component.html',
})
export class PaypalButtonsComponent implements OnInit, OnDestroy {
  private cartItems: CartItem[] = [];
  private cartItemsSub: Subscription | undefined;
  //@ts-ignore
  @ViewChild('paypal', { static: true }) private paypalRef: ElementRef;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private paymentService: PaymentService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cartItemsSub = this.cartService.cart.subscribe(
      (res) => (this.cartItems = res.items)
    );
    this.renderPaypalButton();
  }

  renderPaypalButton() {
    paypal
      ?.Buttons({
        createOrder: (data: any, actions: any) => {
          return this.paymentService
            .createOrder(this.cartItems)
            .then((res) => res.id)
            .catch((err) =>
              this.messageService.add({
                severity: 'error',
                summary: 'Failed to create order',
                detail: `${err.response.data.message}`,
              })
            );
        },
        onApprove: (data: any, actions: any) => {
          this.paymentService.onApprove(data, actions).then((res: any) => {
            this.cartService.closeCheckoutDialog();
            this.cartService.clearCart(false);
            this.router.navigate(['/home']);
            this.messageService.add({
              severity: 'success',
              summary: 'Order complete',
              detail: 'Successfuly complete order.',
            });
          });
        },
        onCancel: (data: any, actions: any) => {
          this.paymentService
            .onCancel({ transactionId: data.orderID })
            .then((res) => {
              this.cartService.closeCheckoutDialog();
              this.messageService.add({
                severity: 'error',
                detail: 'Order canceled.',
              });
            });
        },
      })
      ?.render(this.paypalRef?.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.cartItemsSub) this.cartItemsSub.unsubscribe();
  }
}
