import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _themes = [
    {
      id: 'mdc-light-deeppurple',
      label: 'light-theme',
      mode: 'light',
    },
    {
      id: 'mdc-dark-deeppurple',
      label: 'dark-theme',
      mode: 'dark',
    },
  ];
  mode: 'light' | 'dark' = 'light';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cookieService: CookieService
  ) {}

  get themes() {
    return this._themes;
  }

  switchTheme(theme: string) {
    const themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = `${theme}.css`;
      this.mode = theme.includes('light') ? 'light' : 'dark';
      this.setCookie(theme);
    }
  }

  toggleMode() {
    if (this.mode === 'light') {
      this.switchTheme('mdc-dark-deeppurple');
      this.mode = 'dark';
    } else {
      this.switchTheme('mdc-light-deeppurple');
      this.mode = 'light';
    }
  }

  defaultTheme() {
    const cookie = this.getCookie();
    if (cookie) {
      this.switchTheme(cookie);
    } else {
      this.switchTheme(this.themes[0].id);
    }
  }

  setCookie(theme: string) {
    this.cookieService.set('app-theme', theme, {
      secure: true,
      sameSite: 'Strict',
      path: '/',
      expires: 365,
    });
  }

  getCookie() {
    return this.cookieService.get('app-theme');
  }

  clearCookie() {
    this.cookieService.delete('app-theme', '/');
  }
}
