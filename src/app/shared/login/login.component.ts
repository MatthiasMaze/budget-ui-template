import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

interface LoginProvider {
  name: string;
  logo: string;
  loginMethod: (callback: () => Promise<boolean>) => void;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  readonly loginProviders: LoginProvider[] = [
    { name: 'GitHub', logo: 'logo-github', loginMethod: this.authService.loginWithGithub },
    { name: 'Google', logo: 'logo-google', loginMethod: this.authService.loginWithGoogle },
  ];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  login = (loginProvider: LoginProvider): void => {
    const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] ?? '/';
    loginProvider.loginMethod(() => this.router.navigateByUrl(returnUrl));
  };

}
