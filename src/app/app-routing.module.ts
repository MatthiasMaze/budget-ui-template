import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { categoriesPath, expensesPath, loginPath } from './shared/routes';
import { AuthGuard } from './shared/guard/auth.guard';
import { LoginComponent } from './shared/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: expensesPath,
    pathMatch: 'full',
  },
  {
    path: loginPath,
    component: LoginComponent,
  },
  {
    path: categoriesPath,
    loadChildren: () => import('./category/category.module').then((m) => m.CategoryModule),
    canActivate: [AuthGuard],
  },
  {
    path: expensesPath,
    loadChildren: () => import('./expense/expense.module').then((m) => m.ExpenseModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
