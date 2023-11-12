import { Component, OnInit } from '@angular/core';
import {
  ConfirmEventType,
  ConfirmationService,
  MessageService,
} from 'primeng/api';
import { BookService } from 'src/app/services/book/book.service';
import { Book, BooksPaginationMetadata } from 'src/app/types/book';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  category: string | undefined;
  metadata: BooksPaginationMetadata = {
    totalBooks: 0,
    count: 0,
  };
  loading: boolean = false;
  displayAddEditModal = false;
  selectedBook: Book | null = null;

  constructor(
    private bookService: BookService,
    private confirmService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getBooks();
  }

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

  hideAddModal(isClosed: boolean) {
    this.displayAddEditModal = !isClosed;
  }

  refreshTable(newData?: any) {
    this.getBooks();
  }

  showAddModal() {
    this.displayAddEditModal = true;
    this.selectedBook = null;
  }

  showEditModal(book: Book) {
    this.displayAddEditModal = true;
    this.selectedBook = book;
  }

  deleteBook(book: Book) {
    this.confirmService.confirm({
      message: `Do you want to delete this ${book.title}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.bookService.deleteBook(book).subscribe({
          next: (res) => {
            this.refreshTable();
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmed',
              detail: 'Book deleted',
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Confirmed',
              detail: 'Failed to delete book.',
            });
          },
        });
      },
      reject: (type: ConfirmEventType) => {},
    });
  }

  onSelectCategory(category: string) {
    if (category === 'Select Category') this.category = undefined;
    else this.category = category;

    this.getBooks();
  }
}
