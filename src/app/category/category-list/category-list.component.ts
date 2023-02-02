import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { ModalController } from '@ionic/angular';
import { CategoryService } from '../category.service';
import { Category, PagingCriteria } from '../../shared/domain';
import { ToastService } from '../../shared/service/toast.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  readonly pagingCriteria: PagingCriteria = {
    pageNumber: 0,
    pageSize: 15,
    sortColumn: 'name',
    sortDirection: 'asc',
  };

  constructor(
    private readonly categoryService: CategoryService,
    private readonly modalCtrl: ModalController,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  handleRefresh($event: any): void {
    this.pagingCriteria.pageNumber = 0;
    this.loadCategories(() => $event.target.complete());
  }

  async openModal(category?: Category): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CategoryModalComponent,
      componentProps: {
        category: category ? { ...category } : {},
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log(data, role);
  }

  // --------------
  // Helper methods
  // --------------

  private loadCategories(next: () => void = () => {}): Subscription {
    return this.categoryService.getCategories(this.pagingCriteria).subscribe({
      next: (categories) => {
        if (this.pagingCriteria.pageNumber === 0) this.categories = [];
        this.categories.push(...categories.content);
        next();
      },
      error: (error) => this.toastService.displayErrorToast('Could not load categories', error),
    });
  }
}
