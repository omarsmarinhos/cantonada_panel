import { Component, inject, signal } from '@angular/core';
import { CategoryService } from '../shared/services/category.service';
import { Category } from '../shared/models/Category.model';
import { CommonModule } from '@angular/common';
import { CategoryCardComponent } from "./components/category-card/category-card.component";
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { AlertService } from '../shared/services/alert.service';
import { CategoryAddModalComponent } from './components/category-add-modal/category-add-modal.component';
import { CategoryEditModalComponent } from './components/category-edit-modal/category-edit-modal.component';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

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

  private readonly categoryService = inject(CategoryService);
  private readonly dialog = inject(MatDialog);
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);

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

  onAddCategory() {
    const dialogRef = this.dialog.open(CategoryAddModalComponent, {
      width: '900px'
    }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.addCategory(result.tNombre.trim(), result.imagen, result.lPrincipal).subscribe({
          next: (res) => {
            this.alertService.showSuccess("Categoría agregada");
            this.loadCategories();
          },
          error: (err) => {
            this.errorService.showError(err);
          }
        })
      }
    });
  }

  onEditCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryEditModalComponent, {
      width: '900px',
      data: category
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.editCategory(result).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
            this.loadCategories();
          },
          error: (err) => {
            this.errorService.showError(err);
          }
        })
      }
    });
  }

  onDeleteCategory(iIdCategoria: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.deleteCategory(iIdCategoria).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
            this.loadCategories();
          },
          error: (err) => {
            this.errorService.showError(err);
          }
        })
      }
    });
  }
}
