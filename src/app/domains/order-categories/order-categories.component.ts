import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService } from '../shared/services/category.service';
import { Category } from '../shared/models/Category.model';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { AlertService } from '../shared/services/alert.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { Router } from '@angular/router';

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

  private readonly categoryService = inject(CategoryService);
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly router = inject(Router);

  categories = signal<Category[]>([]);

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.categories(), event.previousIndex, event.currentIndex);
    this.categories.set([...this.categories()]);
  }

  onSaveChanges() {
    const orderedCategories = this.categories().map((category, index) => ({
      iId: category.iIdCategoria,
      nOrden: index
    }));

    this.categoryService.orderCategories(orderedCategories).subscribe({
      next: (res) => {
        this.alertService.showSuccess(res.mensaje);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }

  goToPageBack() {
    this.router.navigate(["/categorias"]);
  }
}
