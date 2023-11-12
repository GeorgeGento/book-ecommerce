import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../types/user';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  isLoggedIn = new BehaviorSubject<boolean>(false);
  user = new BehaviorSubject<User | undefined>(undefined);

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.isLoggedIn.next(!!this.getCookie());
    this.getUser();
  }

  registerUser(userDetails: User) {
    return this.http.post(`${this.baseUrl}/auth/register`, userDetails);
  }

  async loginUser(email: string, password: string): Promise<boolean> {
    try {
      const res = await axios.post(`${this.baseUrl}/auth/login`, {
        email,
        password,
      });
      this.cookieService.set('auth', JSON.stringify(res.data), {
        secure: true,
        sameSite: 'Strict',
        path: '/',
        expires: 7,
      });
      await this.getUser();
      this.isLoggedIn.next(true);

      return true;
    } catch (err) {
      this.isLoggedIn.next(false);
      return false;
    }
  }

  getCookie(): { _id: string; accessToken: string } | null {
    const tokenCookie = this.cookieService.get('auth');
    if (!tokenCookie) return null;

    return JSON.parse(tokenCookie);
  }

  async getUser(): Promise<void> {
    const cookie = this.getCookie();
    if (!cookie) return;
    try {
      const res = await axios.get(`${this.baseUrl}/users/${cookie._id}`, {
        headers: {
          'x-access-token': cookie.accessToken,
        },
      });

      this.isLoggedIn.next(true);
      this.user.next(res.data);
    } catch (err) {
      this.isLoggedIn.next(false);
      return;
    }
  }

  logout() {
    this.cookieService.delete('auth', '/');
    this.user.next(undefined);
    this.isLoggedIn.next(false);
    window.location.reload();
  }
}
