import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BookService } from 'src/app/services/book/book.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { Book, BooksPaginationMetadata } from 'src/app/types/book';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  layout: 'list' | 'grid' = 'list';
  category: string | undefined;
  books: Book[] = [];
  metadata: BooksPaginationMetadata = {
    totalBooks: 0,
    count: 0,
  };
  loading: boolean = false;

  constructor(
    private bookService: BookService,
    private cartService: CartService
  ) {}

  getBooks($event?: any) {
    this.loading = true;
    this.bookService
      .getBooks($event?.first || 0, $event?.rows || 10, this.category)
      .subscribe((res) => {
        this.books = res.data;
        this.metadata = res.metadata;
        this.loading = false;
      });
  }

  onSelectCategory(category: string) {
    if (category === 'Select Category') this.category = undefined;
    else this.category = category;

    this.getBooks();
  }

  addToCart(product: Book) {
    this.cartService.addToCart({ ...product, quantity: 1 });
  }
}
