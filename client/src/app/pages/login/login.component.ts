import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  loginUser() {
    const { email, password } = this.loginForm.value;
    this.authService.loginUser(email!, password!).then((flag) => {
      if (flag) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Logged in successfully.',
        });
        this.router.navigate(['home']);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `${'Something went wrong.'}`,
        });
      }
    });
  }

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }
}
