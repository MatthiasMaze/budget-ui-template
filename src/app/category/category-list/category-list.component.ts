import { Component } from '@angular/core';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { ModalController } from '@ionic/angular';
import { Category } from '../../shared/domain';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent {
  constructor(private readonly modalCtrl: ModalController) {}

  async openModal(category?: Category): Promise<void> {
    const modal = await this.modalCtrl.create({ component: CategoryModalComponent });
    modal.present();
    const { role } = await modal.onWillDismiss();
    console.log('role', role);
  }
}
