import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Category } from '../../shared/domain';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
})
export class CategoryModalComponent implements OnInit {
  // Passed into the component by the ModalController, available in the ngOnInit
  category!: Category;

  readonly categoryForm: FormGroup;

  constructor(private readonly formBuilder: FormBuilder, readonly modalCtrl: ModalController) {
    this.categoryForm = this.formBuilder.group({
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
    this.modalCtrl.dismiss(this.categoryForm.value, 'confirm');
  }

  delete(): void {
    this.modalCtrl.dismiss(null, 'delete');
  }
}
