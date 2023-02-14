import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { categoriesPath, expensesPath, loginPath } from './shared/routes';

const routes: Routes = [
  {
    path: '',
    redirectTo: expensesPath,
    pathMatch: 'full',
  },
  {
    path: categoriesPath,
    loadChildren: () => import('./category/category.module').then((m) => m.CategoryModule),
    title: 'Categories | Budget UI',
  },
  {
    path: expensesPath,
    loadChildren: () => import('./expense/expense.module').then((m) => m.ExpenseModule),
    title: 'Expenses | Budget UI',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
