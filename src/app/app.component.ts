import { Component } from '@angular/core';
import { categoriesPath, expensesPath } from './shared/routes';
import {AuthService} from "./shared/service/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  readonly appPages = [
    { title: 'Expenses', url: `/${expensesPath}`, icon: 'podium' },
    { title: 'Categories', url: `/${categoriesPath}`, icon: 'pricetag' },
  ];

  constructor(readonly authService: AuthService) {}
}
