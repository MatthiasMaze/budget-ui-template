import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { loginPath } from '../routes';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canActivate = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> =>
    this.authService.currentUser().pipe(
      map((user) => {
        if (!user)
          this.router.navigate([`/${loginPath}`], state.url !== '/' ? { queryParams: { returnUrl: state.url } } : {});
        return !!user;
      })
    );
}
