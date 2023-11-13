import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  ConfirmEventType,
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
export class OrdersComponent {
  orders: Order[] = [];
  metadata: OrdersPaginationMetadata = {
    totalOrders: 0,
    count: 0,
  };
  loading: boolean = false;
  displayAddEditModal = false;
  selectedOrder: Order | null = null;

  constructor(
    private orderService: OrderService,
    private confirmService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  getOrders($event?: LazyLoadEvent) {
    this.loading = true;
    this.orderService
      .getOrders($event?.first || 0, $event?.rows || 10)
      .subscribe((res) => {
        this.orders = res.data;
        this.metadata = res.metadata;
        this.loading = false;
      });
  }

  showAddModal() {
    this.displayAddEditModal = true;
    this.selectedOrder = null;
  }

  hideAddModal(isClosed: boolean) {
    this.displayAddEditModal = !isClosed;
  }

  refreshTable(newData?: any) {
    this.getOrders();
  }

  showEditModal(order: Order) {
    this.displayAddEditModal = true;
    this.selectedOrder = order;
  }

  deleteOrder(order: Order) {
    this.confirmService.confirm({
      message: 'Do you want to delete this order?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.orderService.deleteOrder(order).subscribe({
          next: (res) => {
            this.refreshTable();
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmed',
              detail: 'Order deleted',
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Confirmed',
              detail: 'Failed to delete order.',
            });
          },
        });
      },
      reject: (type: ConfirmEventType) => {},
    });
  }

  goToDetails(userId: string, id: string) {
    this.router.navigate([`users/${userId}/orders/${id}`]);
  }
}
