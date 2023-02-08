import { Component } from '@angular/core';
import { addMonths, format, set } from 'date-fns';
import { BehaviorSubject, from, groupBy, mergeMap, toArray } from 'rxjs';
import { InfiniteScrollCustomEvent, ModalController, RefresherCustomEvent } from '@ionic/angular';
import { ExpenseModalComponent } from '../expense-modal/expense-modal.component';
import { Expense, PagingCriteria } from '../../shared/domain';
import { ExpenseService } from '../expense.service';
import { ToastService } from '../../shared/service/toast.service';

interface ExpenseGroup {
  date: string;
  expenses: Expense[];
}

@Component({
  selector: 'app-expense-overview',
  templateUrl: './expense-list.component.html',
})
export class ExpenseListComponent {
  date = new BehaviorSubject<Date>(set(new Date(), { date: 1 }));
  expenseGroups: ExpenseGroup[] | null = null;
  lastPageReached = false;
  loading = false;
  readonly pagingCriteria: PagingCriteria = {
    page: 0,
    size: 25,
    sort: 'date,desc',
  };

  constructor(
    private readonly expenseService: ExpenseService,
    private readonly modalCtrl: ModalController,
    private readonly toastService: ToastService
  ) {
    this.date.subscribe(() => {
      this.expenseGroups = null;
      this.loadExpenses();
    });
  }

  addMonths = (number: number): void => this.date.next(addMonths(this.date.value, number));

  async openModal(expense?: Expense): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ExpenseModalComponent,
      componentProps: { expense: expense ? { ...expense } : {} },
    });
    modal.present();
    const { role } = await modal.onWillDismiss();
    if (role === 'refresh') this.reloadExpenses();
  }

  loadNextExpensePage($event: any) {
    this.pagingCriteria.page++;
    this.loadExpenses(() => ($event as InfiniteScrollCustomEvent).target.complete());
  }

  reloadExpenses($event?: any): void {
    this.pagingCriteria.page = 0;
    this.loadExpenses(() => ($event ? ($event as RefresherCustomEvent).target.complete() : {}));
  }

  // --------------
  // Helper methods
  // --------------

  private loadExpenses(next: () => void = () => {}): void {
    this.loading = true;
    this.expenseService
      .getExpenses({ ...this.pagingCriteria, yearMonth: format(this.date.value, 'yyyyMM') })
      .pipe(
        mergeMap((expensePage) => {
          this.lastPageReached = expensePage.last;
          this.loading = false;
          if (this.pagingCriteria.page === 0 || !this.expenseGroups) this.expenseGroups = [];
          return from(expensePage.content).pipe(
            groupBy((expense) => expense.date),
            mergeMap((group) => group.pipe(toArray()))
          );
        })
      )
      .subscribe({
        next: (expenses: Expense[]) => {
          const expenseGroup: ExpenseGroup = {
            date: expenses[0].date,
            expenses: this.sortExpenses(expenses),
          };
          const expenseGroupWithSameDate = this.expenseGroups!.find((other) => other.date === expenseGroup.date);
          if (!expenseGroupWithSameDate) this.expenseGroups!.push(expenseGroup);
          else
            expenseGroupWithSameDate.expenses = this.sortExpenses([
              ...expenseGroupWithSameDate.expenses,
              ...expenseGroup.expenses,
            ]);
          next();
        },
        error: (error) => {
          this.toastService.displayErrorToast('Could not load expenses', error);
          this.loading = false;
        },
      });
  }

  private sortExpenses = (expenses: Expense[]): Expense[] => expenses.sort((a, b) => a.name.localeCompare(b.name));
}
