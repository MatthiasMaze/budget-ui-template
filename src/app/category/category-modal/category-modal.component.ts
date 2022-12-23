import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
})
export class CategoryModalComponent {
  isCreate!: boolean;

  constructor(private readonly modalCtrl: ModalController) {}

  cancel = (): void => {
    this.modalCtrl.dismiss(null, 'cancel');
  };

  save = (): void => {
    this.modalCtrl.dismiss(null, 'confirm');
  };

  delete = (): void => {
    this.modalCtrl.dismiss(null, 'delete');
  };
}
