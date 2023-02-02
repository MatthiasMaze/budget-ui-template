import { Injectable } from '@angular/core';
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private readonly toastController: ToastController) {}

  displayErrorToast(message: string, error: any): void {
    console.error(message, error);
    this.toastController
      .create({
        message: `${message}. Reason: ${error.error?.message || 'unknown'}`,
        duration: 5000,
        position: 'bottom',
        icon: 'warning',
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel',
            handler: () => {},
          },
        ],
      })
      .then((toast) => toast.present());
  }
}
