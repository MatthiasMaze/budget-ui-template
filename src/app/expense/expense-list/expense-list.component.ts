import { Component } from '@angular/core';
import { addMonths, set } from 'date-fns';
import { BehaviorSubject, from, mergeMap } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ExpenseModalComponent } from '../expense-modal/expense-modal.component';

@Component({
  selector: 'app-expense-overview',
  templateUrl: './expense-list.component.html',
})
export class ExpenseListComponent {
  date = new BehaviorSubject<Date>(set(new Date(), { date: 1 }));

  constructor(private readonly modalCtrl: ModalController) {}

  addMonths = (number: number): void => this.date.next(addMonths(this.date.value, number));

  openModal(): void {
    from(
      this.modalCtrl.create({
        component: ExpenseModalComponent,
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
