import axios from 'axios';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { CartItem } from 'src/app/types/cart';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = environment.baseUrl;

  constructor(private authService: AuthService) {}

  async createOrder(items: CartItem[]) {
    const accessToken = this.authService.getCookie()?.accessToken;
    return axios
      .post(
        `${this.baseUrl}/payments/paypal/create-order`,
        { items },
        {
          headers: {
            'x-access-token': `${accessToken}`,
          },
        }
      )
      .then((res) => res.data);
  }

  async onApprove(data: any, actions: any) {
    const accessToken = this.authService.getCookie()?.accessToken;
    return actions.order.capture().then(async (orderDetails: any) => {
      return axios
        .post(`${this.baseUrl}/payments/paypal/success`, orderDetails, {
          headers: {
            'x-access-token': `${accessToken}`,
          },
        })
        .then((res) => res.data);
    });
  }

  async onCancel(data: any) {
    const accessToken = this.authService.getCookie()?.accessToken;
    return axios
      .post(`${this.baseUrl}/payments/paypal/cancel`, data, {
        headers: {
          'x-access-token': `${accessToken}`,
        },
      })
      .then((res) => res.data);
  }
}
