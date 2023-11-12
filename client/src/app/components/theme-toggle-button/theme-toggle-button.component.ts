import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-theme-toggle-button',
  templateUrl: './theme-toggle-button.component.html',
})
export class ThemeToggleButtonComponent implements OnInit {
  checked: boolean = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.checked = this.themeService.mode === 'dark';
  }

  toggleTheme() {
    this.themeService.toggleMode();
    this.checked = this.themeService.mode === 'dark';
  }
}
