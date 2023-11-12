import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UsersWithPagination } from '../../types/user';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.baseUrl;
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getUsers(skip = 1, limit = 1): Observable<UsersWithPagination> {
    const accessToken = this.authService.getCookie()?.accessToken;
    return this.httpClient.get<UsersWithPagination>(
      `${this.baseUrl}/users?skip=${skip}&limit=${limit}`,
      {
        headers: {
          'x-access-token': `${accessToken}`,
        },
      }
    );
  }

  getUser(id: string): Observable<User> {
    const accessToken = this.authService.getCookie()?.accessToken;
    return this.httpClient.get<User>(`${this.baseUrl}/users/${id}`, {
      headers: {
        'x-access-token': `${accessToken}`,
      },
    });
  }

  addUser(newUser: User): Observable<User> {
    const accessToken = this.authService.getCookie()?.accessToken;
    return this.httpClient.post<User>(`${this.baseUrl}/users`, newUser, {
      headers: {
        'x-access-token': `${accessToken}`,
      },
    });
  }

  editUser(newUser: User): Observable<User> {
    const accessToken = this.authService.getCookie()?.accessToken;
    return this.httpClient.patch<User>(
      `${this.baseUrl}/users/${newUser._id}`,
      newUser,
      {
        headers: {
          'x-access-token': `${accessToken}`,
        },
      }
    );
  }

  deleteUser(user: User): Observable<User> {
    const accessToken = this.authService.getCookie()?.accessToken;
    return this.httpClient.delete<User>(`${this.baseUrl}/users/${user._id}`, {
      headers: {
        'x-access-token': `${accessToken}`,
      },
    });
  }
}
