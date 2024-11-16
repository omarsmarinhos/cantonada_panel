import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CategoryService } from '../shared/services/category.service';
import { AlertService } from '../shared/services/alert.service';
import { ProductService } from '../shared/services/product.service';
import { Category } from '../shared/models/Category.model';
import { Product } from '../shared/models/Product.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CapitalizePipe } from '../shared/pipes/capitalize.pipe';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

@Component({
  selector: 'app-order-productos',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    CdkDropList,
    CdkDrag,
    MatFormFieldModule,
    MatSelectModule,
    CapitalizePipe
  ],
  templateUrl: './order-productos.component.html',
  styleUrl: './order-productos.component.scss'
})
export default class OrderProductosComponent {

  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService)
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);

  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);

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

  loadProducts(tCategoria: string) {
    this.productService.getProducts(tCategoria).subscribe({
      next: (res) => {
        this.products.set(res);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.products(), event.previousIndex, event.currentIndex);
    this.products.set([...this.products()]);
  }

  onSaveChanges() {
    const orderedProducts = this.products().map((product, index) => ({
      iId: product.iIdProducto,
      nOrden: index
    }));

    this.productService.orderProducts(orderedProducts).subscribe({
      next: (res) => {
        this.alertService.showSuccess(res.mensaje);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }

  onSelectChange(tCategory: string) {
    this.loadProducts(tCategory);
  }
}
