import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
})
export class AdminNavbarComponent implements OnInit {
  currentPath: string | undefined;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((_event) => {
      if (
        _event instanceof NavigationStart ||
        _event instanceof NavigationEnd
      ) {
        this.currentPath = _event.url;
      }
    });
  }
}
