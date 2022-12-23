import { Component } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { filter, from, mergeMap } from 'rxjs';
import { CategoryModalComponent } from '../../category/category-modal/category-modal.component';

@Component({
  selector: 'app-expense-modal',
  templateUrl: './expense-modal.component.html',
})
export class ExpenseModalComponent {
  constructor(private readonly actionSheetCtrl: ActionSheetController, private readonly modalCtrl: ModalController) {}

  cancel = (): void => {
    this.modalCtrl.dismiss(null, 'cancel');
  };

  save = (): void => {
    this.modalCtrl.dismiss(null, 'confirm');
  };

  delete = (): void => {
    from(
      this.actionSheetCtrl.create({
        header: 'Confirm Deletion',
        subHeader: 'Are you sure you want to delete this cost?',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            data: { action: 'delete' },
            icon: 'trash',
          },
          {
            text: 'Cancel',
            role: 'cancel',
            data: { action: 'cancel' },
            icon: 'close',
          },
        ],
      })
    )
      .pipe(
        mergeMap((actionSheet) => {
          actionSheet.present();
          return from(actionSheet.onDidDismiss());
        }),
        filter((event) => event.data.action === 'delete'),
        mergeMap(() => this.modalCtrl.dismiss(null, 'delete'))
      )
      .subscribe();
  };

  showCategoryModal(): void {
    from(
      this.modalCtrl.create({
        component: CategoryModalComponent,
        componentProps: {
          isCreate: true,
        },
      })
    )
      .pipe(
        mergeMap((modal) => {
          modal.present();
          return from(modal.onWillDismiss());
        })
      )
      .subscribe((event) => console.log(event));
  }
}
