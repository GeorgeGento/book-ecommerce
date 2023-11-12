import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user/user.service';
import { passwordMatchValidator } from 'src/app/shared/password-match.directive';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-add-edit-user-modal',
  templateUrl: './add-edit-user-modal.component.html',
})
export class AddEditUserModalComponent implements OnChanges {
  @Input() displayAddModal: boolean = true;
  @Input() selectedUser: User | null = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAdd: EventEmitter<any> = new EventEmitter<any>();
  modalType = 'Add';

  userForm = this.fb.group(
    {
      _id: [''],
      firstName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)],
      ],
      lastName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      age: [0, Validators.required],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]+(?: [0-9]+)*$/)],
      ],
    },
    {
      validators: passwordMatchValidator,
    }
  );
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnChanges(): void {
    if (this.selectedUser) {
      this.modalType = 'Edit';
      this.userForm.patchValue(this.selectedUser);
    } else {
      this.modalType = 'Add';
      this.userForm.reset();
    }
  }

  closeModal() {
    this.userForm.reset();
    this.clickClose.emit(true);
  }

  addUser() {
    //@ts-ignore
    this.userService.addUser(this.userForm.value).subscribe({
      next: (response) => {
        this.clickAdd.emit(response);
        this.closeModal();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User added',
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

  editUser() {
    //@ts-ignore
    this.userService.editUser(this.userForm.value).subscribe({
      next: (response) => {
        this.clickAdd.emit(response);
        this.closeModal();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User '${response.firstName} '`,
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

  get firstName() {
    return this.userForm.controls['firstName'];
  }

  get lastName() {
    return this.userForm.controls['lastName'];
  }

  get email() {
    return this.userForm.controls['email'];
  }

  get password() {
    return this.userForm.controls['password'];
  }

  get confirmPassword() {
    return this.userForm.controls['confirmPassword'];
  }

  get age() {
    return this.userForm.controls['age'];
  }

  get phoneNumber() {
    return this.userForm.controls['phoneNumber'];
  }
}
