import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { OrderService } from 'src/app/services/order/order.service';
import { Order, OrdersPaginationMetadata } from 'src/app/types/order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
})
export class UserOrdersComponent {
  orders: Order[] = [];
  metadata: OrdersPaginationMetadata = {
    totalOrders: 0,
    count: 0,
  };
  loading: boolean = false;
  userId: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private confirmService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.route.params.subscribe((params) => (this.userId = params['userId']));
  }

  getOrders($event?: LazyLoadEvent) {
    if (!this.userId) return;

    this.loading = true;
    this.orderService
      .getUserOrders($event?.first || 0, $event?.rows || 10, this.userId)
      .subscribe((res) => {
        this.orders = res.data;
        this.metadata = res.metadata;
        this.loading = false;
      });
  }

  goToDetails(id: string) {
    this.router.navigate([`users/${this.userId}/orders/${id}`]);
  }
}
