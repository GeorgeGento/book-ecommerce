import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BookService } from 'src/app/services/book/book.service';

type Category = {
  name: string;
  value: string;
};

@Component({
  selector: 'app-categories-filter',
  templateUrl: './categories-filter.component.html',
})
export class CategoriesFilterComponent implements OnInit {
  categories: string[] = [];
  selectedCategory: string | undefined;
  @Output() selectCategory: EventEmitter<string> = new EventEmitter<string>();

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getCategories().subscribe({
      next: (res) => (this.categories = res),
    });
  }

  onChangeCategory(event: any) {
    this.selectCategory.emit(event.value);
  }
}
