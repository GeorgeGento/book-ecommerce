import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { OrderService } from 'src/app/services/order/order.service';
import { emptyStatusDropdownValidator } from 'src/app/shared/empty-dropdown.directive';
import { Order } from 'src/app/types/order';

@Component({
  selector: 'app-add-edit-order-modal',
  templateUrl: './add-edit-order-modal.component.html',
})
export class AddEditOrderModalComponent {
  @Input() displayAddModal: boolean = false;
  @Input() selectedOrder: Order | null = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAdd: EventEmitter<any> = new EventEmitter<any>();

  statuses: string[] = [
    'PENDING',
    'CREATED',
    'CONFIRMED',
    'DECLINED',
  ];
  modalType = 'Add';

  orderForm = this.fb.group(
    {
      _id: [''],
      transactionId: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      userEmail: ['', [Validators.required, Validators.email]],
      products: ['', []],
      totalPrice: ['', [Validators.required]],
      transactionDetails: ['', []],
      status: ['', [Validators.required]],
    },
    {
      validators: emptyStatusDropdownValidator,
    }
  );

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.selectedOrder) {
      this.modalType = 'Edit';
      //@ts-ignore
      this.orderForm.patchValue(this.selectedOrder);
    } else {
      this.modalType = 'Add';
      this.orderForm.reset();
    }
  }

  closeModal() {
    this.orderForm.reset();
    this.clickClose.emit(true);
  }

  addOrder() {
    //@ts-ignore
    this.orderService.addOrder(this.orderForm.value).subscribe({
      next: (response) => {
        this.clickAdd.emit(response);
        this.closeModal();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Order added',
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

  editOrder() {
    //@ts-ignore
    this.orderService.editOrder(this.orderForm.value).subscribe({
      next: (response) => {
        this.clickAdd.emit(response);
        this.closeModal();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Successfuly edited order.`,
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

  get transactionId() {
    return this.orderForm.controls['transactionId'];
  }

  get userId() {
    return this.orderForm.controls['userId'];
  }

  get userEmail() {
    return this.orderForm.controls['userEmail'];
  }

  get products() {
    return this.orderForm.controls['products'];
  }

  get totalPrice() {
    return this.orderForm.controls['totalPrice'];
  }

  get transactionDetails() {
    return this.orderForm.controls['transactionDetails'];
  }

  get status() {
    return this.orderForm.controls['status'];
  }
}
