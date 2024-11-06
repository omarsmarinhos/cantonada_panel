import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService } from '../shared/services/category.service';
import { Category } from '../shared/models/Category.model';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-order-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './order-categories.component.html',
  styleUrl: './order-categories.component.scss'
})
export default class OrderCategoriesComponent {

  readonly categoryService = inject(CategoryService);
  readonly alertService = inject(AlertService);

  categories = signal<Category[]>([]);

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res);
      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.categories(), event.previousIndex, event.currentIndex);
    this.categories.set([...this.categories()]);
  }

  onSaveChanges() {
    const orderedCategories = this.categories().map((category, index) => ({
      iIdCategoria: category.iIdCategoria,
      nOrden: index // el nuevo orden después de arrastrar
    }));

    console.log(orderedCategories);

    this.categoryService.orderCategories(orderedCategories).subscribe({
      next: (res) => {
        this.alertService.showSuccess(res.mensaje);
      },
      error: (err) => {
        console.log(err);
        if (err.error.detalles) {
          this.alertService.showWarning(err.error.detalles);
        } else {
          this.alertService.showError("Ocurrió un error");
          console.error(err);
        }
      }
    });
  }
}
