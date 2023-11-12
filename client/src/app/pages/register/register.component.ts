import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/types/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { passwordMatchValidator } from 'src/app/shared/password-match.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm = this.fb.group(
    {
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
      age: [undefined, Validators.required],
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
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  submitDetails() {
    this.authService
      .registerUser({
        ...this.registerForm.value,
        age: 20,
        phoneNumber: '12312312',
      } as User)
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Register successfully.',
          });
          this.router.navigate(['login']);
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong.',
          });
        }
      );
  }

  get firstName() {
    return this.registerForm.controls['firstName'];
  }

  get lastName() {
    return this.registerForm.controls['lastName'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  get age() {
    return this.registerForm.controls['age'];
  }

  get phoneNumber() {
    return this.registerForm.controls['phoneNumber'];
  }
}
