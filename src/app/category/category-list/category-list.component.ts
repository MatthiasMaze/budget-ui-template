import { Component, OnInit } from '@angular/core';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { InfiniteScrollCustomEvent, ModalController, RefresherCustomEvent } from '@ionic/angular';
import { CategoryService } from '../category.service';
import { Category, PagingCriteria } from '../../shared/domain';
import { ToastService } from '../../shared/service/toast.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent implements OnInit {
  categories: Category[] | null = null;
  lastPageReached = false;
  loading = false;
  readonly pagingCriteria: PagingCriteria = {
    page: 0,
    size: 25,
    sort: 'name,asc',
  };

  constructor(
    private readonly categoryService: CategoryService,
    private readonly modalCtrl: ModalController,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  async openModal(category?: Category): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CategoryModalComponent,
      componentProps: { category: category ? { ...category } : {} },
    });
    modal.present();
    const { role } = await modal.onWillDismiss();
    if (role === 'refresh') this.reloadCategories();
  }

  loadNextCategoryPage($event: any) {
    this.pagingCriteria.page++;
    this.loadCategories(() => ($event as InfiniteScrollCustomEvent).target.complete());
  }

  reloadCategories($event?: any): void {
    this.pagingCriteria.page = 0;
    this.loadCategories(() => ($event ? ($event as RefresherCustomEvent).target.complete() : {}));
  }

  // --------------
  // Helper methods
  // --------------

  private loadCategories(next: () => void = () => {}): void {
    this.loading = true;
    this.categoryService.getCategories(this.pagingCriteria).subscribe({
      next: (categories) => {
        if (this.pagingCriteria.page === 0 || !this.categories) this.categories = [];
        this.categories.push(...categories.content);
        this.lastPageReached = categories.last;
        next();
        this.loading = false;
      },
      error: (error) => {
        this.toastService.displayErrorToast('Could not load categories', error);
        this.loading = false;
      },
    });
  }
}
