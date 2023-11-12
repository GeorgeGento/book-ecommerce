import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user/user.service';
import { passwordMatchValidator } from 'src/app/shared/password-match.directive';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  user: User | undefined;
  profileForm = this.fb.group({
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
    age: [0, Validators.required],
    phoneNumber: [
      '',
      [Validators.required, Validators.pattern(/^[0-9]+(?: [0-9]+)*$/)],
    ],
  });

  showPasswordModal: boolean = false;
  passwordForm = this.fb.group(
    {
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: passwordMatchValidator,
    }
  );

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.route.params.subscribe((params) => {
      this.userService
        .getUser(params['userId'])
        .subscribe((_user) => this.profileForm.patchValue(_user));
    });
  }

  editUser() {
    //@ts-ignore
    this.userService.editUser(this.profileForm.value).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Saved changes.`,
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

  changePassword() {
    this.userService //@ts-ignore
      .editUser({
        _id: this.profileForm.value._id!,
        ...this.passwordForm.value,
      })
      .subscribe({
        next: (response) => {
          this.closePasswordModal();
          this.messageService.add({
            severity: 'success',
            detail: `Password has been changed.`,
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

  openPasswordModal() {
    this.resetPasswordForm();
    this.showPasswordModal = true;
  }

  closePasswordModal() {
    this.resetPasswordForm();
    this.showPasswordModal = false;
  }

  resetPasswordForm() {
    this.passwordForm.patchValue({ password: '', confirmPassword: '' });
  }

  get firstName() {
    return this.profileForm.controls['firstName'];
  }

  get lastName() {
    return this.profileForm.controls['lastName'];
  }

  get email() {
    return this.profileForm.controls['email'];
  }

  get age() {
    return this.profileForm.controls['age'];
  }

  get phoneNumber() {
    return this.profileForm.controls['phoneNumber'];
  }

  get password() {
    return this.passwordForm.controls['password'];
  }

  get confirmPassword() {
    return this.passwordForm.controls['confirmPassword'];
  }
}
