import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Order, OrdersWithPagination } from '../../types/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = environment.baseUrl;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getOrders(skip = 1, limit = 1): Observable<OrdersWithPagination> {
    const accessToken = this.authService.getCookie()?.accessToken;
    return this.httpClient.get<OrdersWithPagination>(
      `${this.baseUrl}/orders?skip=${skip}&limit=${limit}`,
      {
        headers: {
          'x-access-token': `${accessToken}`,
        },
      }
    );
  }

  getUserOrders(
    skip = 1,
    limit = 1,
    id: string
  ): Observable<OrdersWithPagination> {
    const accessToken = this.authService.getCookie()?.accessToken;
    return this.httpClient.get<OrdersWithPagination>(
      `${this.baseUrl}/orders/users/${id}?skip=${skip}&limit=${limit}`,
      {
        headers: {
          'x-access-token': `${accessToken}`,
        },
      }
    );
  }

  getOrder(id: string): Observable<Order> {
    const accessToken = this.authService.getCookie()?.accessToken;
    return this.httpClient.get<Order>(`${this.baseUrl}/orders/${id}`, {
      headers: {
        'x-access-token': `${accessToken}`,
      },
    });
  }

  addOrder(newOrder: Order): Observable<Order> {
    const accessToken = this.authService.getCookie()?.accessToken;
    return this.httpClient.post<Order>(`${this.baseUrl}/orders`, newOrder, {
      headers: {
        'x-access-token': `${accessToken}`,
      },
    });
  }

  editOrder(newOrder: Order): Observable<Order> {
    const accessToken = this.authService.getCookie()?.accessToken;
    return this.httpClient.patch<Order>(
      `${this.baseUrl}/orders/${newOrder._id}`,
      newOrder,
      {
        headers: {
          'x-access-token': `${accessToken}`,
        },
      }
    );
  }

  deleteOrder(order: Order): Observable<Order> {
    const accessToken = this.authService.getCookie()?.accessToken;
    return this.httpClient.delete<Order>(
      `${this.baseUrl}/orders/${order._id}`,
      {
        headers: {
          'x-access-token': `${accessToken}`,
        },
      }
    );
  }
}
