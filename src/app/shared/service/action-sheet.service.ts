import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ActionSheetService {
  constructor(private readonly actionSheetCtrl: ActionSheetController) {}

  async showDeletionConfirmation(message: string): Promise<string> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Confirm Deletion',
      subHeader: message,
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
    });
    actionSheet.present();
    const { data } = await actionSheet.onDidDismiss();
    return data.action;
  }
}
