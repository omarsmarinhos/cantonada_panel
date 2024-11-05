import { Component, inject, signal } from '@angular/core';
import { CategoryService } from '../shared/services/category.service';
import { Category } from '../shared/models/Category.model';
import { CommonModule } from '@angular/common';
import { CategoryCardComponent } from "./components/category-card/category-card.component";
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    CategoryCardComponent,
    MatIconModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export default class CategoriesComponent {

  readonly categoryService = inject(CategoryService);
  readonly dialog = inject(MatDialog);
  readonly alertService = inject(AlertService);

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

      }
    })
  }

  onEditCategory(category: Category) {
    console.log(category)
    alert('edit ' + category.iIdCategoria);
  }

  onDeleteCategory(iIdCategoria: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.deleteCategory(iIdCategoria).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
            this.loadCategories();
          }
        })
      }
    });
  }


}
