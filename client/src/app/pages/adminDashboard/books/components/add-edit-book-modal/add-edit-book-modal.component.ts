import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BookService } from 'src/app/services/book/book.service';
import { emptyCategoryDropdownValidator } from 'src/app/shared/empty-dropdown.directive';
import { Book } from 'src/app/types/book';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-edit-book-modal',
  templateUrl: './add-edit-book-modal.component.html',
})
export class AddEditBookModalComponent implements OnInit, OnChanges {
  imageUploadUrl = `${environment.baseUrl}/upload/image`;
  @Input() displayAddModal: boolean = false;
  @Input() selectedBook: Book | null = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAdd: EventEmitter<any> = new EventEmitter<any>();

  categories: string[] = [];
  loaded: boolean = false;
  showFileUpload: boolean = false;
  modalType = 'Add';

  bookForm = this.fb.group({
    _id: [''],
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    tags: ['', [Validators.required]],
    imageUrl: ['', [Validators.required]],

    price: [0, [Validators.required]],
    stock: [0, [Validators.required]],
    author: ['', [Validators.required]],
    publisher: [''],
  },{
    validators: emptyCategoryDropdownValidator,
  });

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.bookService.getCategories().subscribe({
      next: (_categories) =>
        (this.categories = ['Select Category', ..._categories]),
    });
  }

  ngOnChanges(): void {
    if (this.selectedBook) {
      this.modalType = 'Edit';
      this.bookForm.reset();
      //@ts-ignore
      this.bookForm.patchValue(this.selectedBook);
      this.loaded = true;
    } else {
      this.modalType = 'Add';
      this.loaded = true;
      this.bookForm.reset();
    }

    if (this.hasImageUrl()) this.showFileUpload = false;
    else this.showFileUpload = true;
  }

  openFileUpload() {
    this.showFileUpload = true;
  }

  closeFileUpload() {
    this.showFileUpload = false;
  }

  closeModal() {
    this.bookForm.reset();
    this.clickClose.emit(true);
  }

  addBook() {
    //@ts-ignore
    this.bookService.addBook(this.bookForm.value).subscribe({
      next: (response) => {
        this.clickAdd.emit(response);
        this.closeModal();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Book added',
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
    });
  }

  editBook() {
    //@ts-ignore
    this.bookService.editBook(this.bookForm.value).subscribe({
      next: (response) => {
        this.clickAdd.emit(response);
        this.closeModal();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Successfuly edited book.`,
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
    });
  }

  onUpload(event: any) {
    this.bookForm.patchValue({ imageUrl: event.originalEvent.body.imageUrl });
    this.closeFileUpload();
  }

  hasImageUrl() {
    return this.bookForm.controls['imageUrl'].value?.length;
  }

  get title() {
    return this.bookForm.controls['title'];
  }

  get description() {
    return this.bookForm.controls['description'];
  }

  get tags() {
    return this.bookForm.controls['tags'];
  }

  get imageUrl() {
    return this.bookForm.controls['imageUrl'];
  }

  get price() {
    return this.bookForm.controls['price'];
  }

  get stock() {
    return this.bookForm.controls['stock'];
  }

  get author() {
    return this.bookForm.controls['author'];
  }

  get publisher() {
    return this.bookForm.controls['publisher'];
  }
}
