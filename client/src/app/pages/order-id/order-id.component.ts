import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart/cart.service';
import { OrderService } from 'src/app/services/order/order.service';
import { UserService } from 'src/app/services/user/user.service';
import { Book } from 'src/app/types/book';
import { Order } from 'src/app/types/order';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-order-id',
  templateUrl: './order-id.component.html',
})
export class OrderIdComponent implements OnInit {
  userId: string | undefined;
  orderId: string | undefined;
  order: Order | undefined;
  user: User | undefined;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private userService: UserService,
    private cartService: CartService
  ) {
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];
      this.orderId = params['orderId'];
    });
  }

  ngOnInit(): void {
    this.orderService
      .getOrder(this.orderId!)
      .subscribe((res) => (this.order = res));

    this.userService
      .getUser(this.userId!)
      .subscribe((res) => (this.user = res));
  }

  addToCart(product: Book) {
    this.cartService.addToCart({ ...product, quantity: 1 });
  }
}
