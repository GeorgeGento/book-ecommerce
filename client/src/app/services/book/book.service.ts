import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Book, BooksWithPagination } from '../../types/book';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseUrl = environment.baseUrl;
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getBooks(
    skip = 1,
    limit = 1,
    category?: string
  ): Observable<BooksWithPagination> {
    return this.httpClient.get<BooksWithPagination>(
      `${this.baseUrl}/books${
        category ? `/categories/${category}` : ''
      }?skip=${skip}&limit=${limit}`
    );
  }

  getBook(id: string): Observable<Book> {
    return this.httpClient.get<Book>(`${this.baseUrl}/books/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.httpClient.get<string[]>(
      `${this.baseUrl}/books/categories/list`
    );
  }

  addBook(newBook: Book): Observable<Book> {
    const accessToken = this.authService.getCookie()?.accessToken;
    return this.httpClient.post<Book>(`${this.baseUrl}/books`, newBook, {
      headers: {
        'x-access-token': `${accessToken}`,
      },
    });
  }

  editBook(newBook: Book): Observable<Book> {
    const accessToken = this.authService.getCookie()?.accessToken;
    return this.httpClient.patch<Book>(
      `${this.baseUrl}/books/${newBook._id}`,
      newBook,
      {
        headers: {
          'x-access-token': `${accessToken}`,
        },
      }
    );
  }

  deleteBook(book: Book): Observable<Book> {
    const accessToken = this.authService.getCookie()?.accessToken;
    return this.httpClient.delete<Book>(`${this.baseUrl}/books/${book._id}`, {
      headers: {
        'x-access-token': `${accessToken}`,
      },
    });
  }
}
