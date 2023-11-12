import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { User } from './types/user';
import { ThemeService } from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'client';
  user: User | undefined;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe((_user) => (this.user = _user));
    this.themeService.defaultTheme();
  }
}
