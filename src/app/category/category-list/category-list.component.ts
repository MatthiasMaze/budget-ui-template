import { Component, OnInit } from '@angular/core';
import { from, mergeMap } from 'rxjs';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent implements OnInit {
  constructor(private readonly modalCtrl: ModalController) {}

  ngOnInit() {}

  openModal() {
    from(
      this.modalCtrl.create({
        component: CategoryModalComponent,
        componentProps: {
          isCreate: false,
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
