import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, filter, from, mergeMap } from 'rxjs';
import { CategoryModalComponent } from '../../category/category-modal/category-modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format, formatISO, parseISO } from 'date-fns';
import { CategoryService } from '../../category/category.service';
import { Category, Expense } from '../../shared/domain';
import { ToastService } from '../../shared/service/toast.service';
import { ExpenseService } from '../expense.service';
import { ActionSheetService } from '../../shared/service/action-sheet.service';

@Component({
  selector: 'app-expense-modal',
  templateUrl: './expense-modal.component.html',
})
export class ExpenseModalComponent implements OnInit {
  // Passed into the component by the ModalController, available in the ngOnInit
  expense: Expense = {} as Expense;

  categories: Category[] = [];
  readonly expenseForm: FormGroup;
  submitting = false;

  constructor(
    private readonly actionSheetService: ActionSheetService,
    private readonly categoryService: CategoryService,
    private readonly expenseService: ExpenseService,
    private readonly formBuilder: FormBuilder,
    private readonly modalCtrl: ModalController,
    private readonly toastService: ToastService
  ) {
    this.expenseForm = this.formBuilder.group({
      id: [], // hidden
      amount: ['', [Validators.required, Validators.min(0.01)]],
      categoryId: [],
      date: [formatISO(new Date()), [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(40)]],
    });
  }

  ngOnInit(): void {
    const { id, amount, category, date, name } = this.expense;
    if (category) this.categories.push(category);
    if (id) this.expenseForm.patchValue({ id, amount, categoryId: category?.id, date, name });
    this.loadCategories();
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save(): void {
    this.submitting = true;
    this.expenseService
      .upsertExpense({ ...this.expenseForm.value, date: format(parseISO(this.expenseForm.value.date), 'yyyy-MM-dd') })
      .subscribe({
        next: () => {
          this.toastService.displaySuccessToast('Expense saved');
          this.modalCtrl.dismiss(null, 'refresh');
          this.submitting = false;
        },
        error: (error) => {
          this.toastService.displayErrorToast('Could not save expense', error);
          this.submitting = false;
        },
      });
  }

  delete(): void {
    from(this.actionSheetService.showDeletionConfirmation('Are you sure you want to delete this expense?'))
      .pipe(
        filter((action) => action === 'delete'),
        mergeMap(() => {
          this.submitting = true;
          return this.expenseService.deleteExpense(this.expense.id);
        })
      )
      .subscribe({
        next: () => {
          this.toastService.displaySuccessToast('Expense deleted');
          this.modalCtrl.dismiss(null, 'refresh');
          this.submitting = false;
        },
        error: (error) => {
          this.toastService.displayErrorToast('Could not delete expense', error);
          this.submitting = false;
        },
      });
  }

  async showCategoryModal(): Promise<void> {
    const categoryModal = await this.modalCtrl.create({ component: CategoryModalComponent });
    categoryModal.present();
    const { role } = await categoryModal.onWillDismiss();
    if (role === 'refresh') this.loadCategories();
  }

  // --------------
  // Helper methods
  // --------------

  private loadCategories(): void {
    const pageToLoad = new BehaviorSubject(0);
    pageToLoad
      .pipe(mergeMap((page) => this.categoryService.getCategories({ page, size: 25, sort: 'name,asc' })))
      .subscribe({
        next: (categories) => {
          if (pageToLoad.value === 0) this.categories = [];
          this.categories.push(...categories.content);
          if (!categories.last) pageToLoad.next(pageToLoad.value + 1);
        },
        error: (error) => this.toastService.displayErrorToast('Could not load categories', error),
      });
  }
}
