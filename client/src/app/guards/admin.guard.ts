import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isLoggedIn.value) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!this.authService.user.value?.admin) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
