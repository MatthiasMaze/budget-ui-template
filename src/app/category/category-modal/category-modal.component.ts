import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Category } from '../../shared/domain';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../category.service';
import { ToastService } from '../../shared/service/toast.service';
import { ActionSheetService } from '../../shared/service/action-sheet.service';
import { filter, from, mergeMap } from 'rxjs';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
})
export class CategoryModalComponent implements OnInit {
  // Passed into the component by the ModalController, available in the ngOnInit
  category!: Category;

  readonly categoryForm: FormGroup;

  constructor(
    private readonly actionSheetService: ActionSheetService,
    private readonly categoryService: CategoryService,
    private readonly formBuilder: FormBuilder,
    private readonly modalCtrl: ModalController,
    private readonly toastService: ToastService
  ) {
    this.categoryForm = this.formBuilder.group({
      id: [], // hidden
      name: ['', [Validators.required, Validators.maxLength(40)]],
    });
  }

  ngOnInit(): void {
    if (this.category) this.categoryForm.patchValue(this.category);
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save(): void {
    this.categoryService.upsertCategory(this.categoryForm.value).subscribe({
      next: () => {
        this.toastService.displaySuccessToast('Category saved');
        this.modalCtrl.dismiss(null, 'refresh');
      },
      error: (error) => this.toastService.displayErrorToast('Could not save category', error),
    });
  }

  delete(): void {
    from(this.actionSheetService.showDeletionConfirmation('Are you sure you want to delete this category?'))
      .pipe(
        filter((action) => action === 'delete'),
        mergeMap(() => this.categoryService.deleteCategory(this.category.id!))
      )
      .subscribe({
        next: () => {
          this.toastService.displaySuccessToast('Category deleted');
          this.modalCtrl.dismiss(null, 'refresh');
        },
        error: (error) => this.toastService.displayErrorToast('Could not delete category', error),
      });
  }
}
