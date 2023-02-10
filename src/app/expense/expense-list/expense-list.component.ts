import { Component, OnDestroy, OnInit } from '@angular/core';
import { addMonths, set } from 'date-fns';
import { BehaviorSubject, debounce, from, groupBy, interval, mergeMap, Subject, takeUntil, toArray } from 'rxjs';
import { InfiniteScrollCustomEvent, ModalController, RefresherCustomEvent } from '@ionic/angular';
import { ExpenseModalComponent } from '../expense-modal/expense-modal.component';
import { Category, Expense, ExpenseCriteria, SortOption } from '../../shared/domain';
import { ExpenseService } from '../expense.service';
import { ToastService } from '../../shared/service/toast.service';
import { formatPeriod } from '../../shared/period';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryService } from '../../category/category.service';

interface ExpenseGroup {
  date: string;
  expenses: Expense[];
}

@Component({
  selector: 'app-expense-overview',
  templateUrl: './expense-list.component.html',
})
export class ExpenseListComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  date = set(new Date(), { date: 1 });
  expenseGroups: ExpenseGroup[] | null = null;
  readonly initialSort = 'date,desc';
  lastPageReached = false;
  loading = false;
  searchCriteria: ExpenseCriteria = { page: 0, size: 25, sort: this.initialSort };
  readonly searchForm: FormGroup;
  readonly sortOptions: SortOption[] = [
    { label: 'Created at (newest first)', value: 'createdAt,desc' },
    { label: 'Created at (oldest first)', value: 'createdAt,asc' },
    { label: 'Date (newest first)', value: 'date,desc' },
    { label: 'Date (oldest first)', value: 'date,asc' },
    { label: 'Name (A-Z)', value: 'name,asc' },
    { label: 'Name (Z-A)', value: 'name,desc' },
  ];
  private readonly unsubscribe = new Subject<void>();

  constructor(
    private readonly categoryService: CategoryService,
    private readonly expenseService: ExpenseService,
    private readonly formBuilder: FormBuilder,
    private readonly modalCtrl: ModalController,
    private readonly toastService: ToastService
  ) {
    this.searchForm = this.formBuilder.group({
      categoryIds: [[]],
      name: [],
      sort: [this.initialSort],
    });
    this.searchForm.valueChanges
      .pipe(
        takeUntil(this.unsubscribe),
        debounce((value) => (value.name?.length ? interval(400) : interval(0)))
      )
      .subscribe((value) => {
        this.searchCriteria = { ...this.searchCriteria, ...value, page: 0 };
        this.loadExpenses();
      });
  }

  ngOnInit(): void {
    this.loadAllCategories();
    this.loadExpenses();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  addMonths = (number: number): void => {
    this.searchCriteria.page = 0;
    this.expenseGroups = null;
    this.date = addMonths(this.date, number);
    this.loadExpenses();
  };

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
    this.searchCriteria.page++;
    this.loadExpenses(() => ($event as InfiniteScrollCustomEvent).target.complete());
  }

  reloadExpenses($event?: any): void {
    this.searchCriteria.page = 0;
    this.loadExpenses(() => ($event ? ($event as RefresherCustomEvent).target.complete() : {}));
  }

  // --------------
  // Helper methods
  // --------------

  private loadAllCategories(): void {
    const pageToLoad = new BehaviorSubject(0);
    pageToLoad
      .pipe(mergeMap((page) => this.categoryService.getCategories({ page, size: 25, sort: 'name,asc' })))
      .subscribe({
        next: (categories) => {
          this.categories.push(...categories.content);
          if (!categories.last) pageToLoad.next(pageToLoad.value + 1);
        },
        error: (error) => this.toastService.displayErrorToast('Could not load categories', error),
      });
  }

  private loadExpenses(next: () => void = () => {}): void {
    this.searchCriteria.yearMonth = formatPeriod(this.date);
    if (!this.searchCriteria.categoryIds?.length) delete this.searchCriteria.categoryIds;
    if (!this.searchCriteria.name) delete this.searchCriteria.name;
    this.loading = true;
    this.expenseService
      .getExpenses(this.searchCriteria)
      .pipe(
        mergeMap((expensePage) => {
          this.lastPageReached = expensePage.last;
          this.loading = false;
          if (this.searchCriteria.page === 0 || !this.expenseGroups) this.expenseGroups = [];
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
