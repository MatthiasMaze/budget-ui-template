import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryRoutingModule } from './category-routing.module';
import { IonicModule } from '@ionic/angular';
import { CategoryModalComponent } from './category-modal/category-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CategoryListComponent, CategoryModalComponent],
  imports: [CommonModule, CategoryRoutingModule, IonicModule, ReactiveFormsModule],
})
export class CategoryModule {}
