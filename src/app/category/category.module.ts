import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryRoutingModule } from './category-routing.module';
import { IonicModule } from '@ionic/angular';
import { CategoryModalComponent } from './category-modal/category-modal.component';

@NgModule({
  declarations: [CategoryListComponent, CategoryModalComponent],
  imports: [CommonModule, CategoryRoutingModule, IonicModule],
})
export class CategoryModule {}
