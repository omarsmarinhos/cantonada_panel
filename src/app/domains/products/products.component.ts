import { Component, inject, signal } from '@angular/core';
import { AlertService } from '../shared/services/alert.service';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService } from '../shared/services/category.service';
import { Category } from '../shared/models/Category.model';
import { Product } from '../shared/models/Product.model';
import { ProductCardComponent } from "./components/product-card/product-card.component";
import { MatDialog } from '@angular/material/dialog';
import { ProductAddModalComponent } from './components/product-add/product-add.component';
import { CapitalizePipe } from '../shared/pipes/capitalize.pipe';
import { ProductService } from '../shared/services/product.service';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MatIconModule,
    ProductCardComponent,
    CapitalizePipe
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export default class ProductsComponent {

  readonly categoryService = inject(CategoryService);
  readonly productService = inject(ProductService);
  readonly alertService = inject(AlertService);
  readonly dialog = inject(MatDialog);

  categories = signal<Category[]>([]);
  selectedCategory: string = 'Todos';

  products = signal<Product[]>([])

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res);
      }
    });
  }

  changeCategory(category: string) {
    this.selectedCategory = category;
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(this.selectedCategory).subscribe({
      next: (res) => {
        this.products.set(res);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  onAddProduct() {
    const dialogRef = this.dialog.open(ProductAddModalComponent, {
      width: '900px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.addProduct(result).subscribe({
          next: (res) => {
            this.alertService.showSuccess("Producto agregado");
            this.loadProducts();
          },
          error: (err) => {
            console.log(err);
            if (err.error.detalles) {
              this.alertService.showWarning(err.error.detalles);
            } else {
              this.alertService.showError("Ocurrió un error");
            }
          }
        })
      }
    });
  }

  onEditProduct(product: Product) {
    const dialogRef = this.dialog.open(ProductEditComponent, {
      width: '900px',
      data: product
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.productService.editProduct(result).subscribe({
        //   next: (res) => {
        //     this.alertService.showSuccess(res.mensaje);
        //     this.loadProducts();
        //   },
        //   error: (err) => {
        //     console.log(err);
        //     if (err.error.detalles) {
        //       this.alertService.showWarning(err.error.detalles);
        //     } else {
        //       this.alertService.showError("Ocurrió un error");
        //       console.error(err);
        //     }
        //   }
        // })
      }
    });
  }

  onDeleteProduct(iIdProducto: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(iIdProducto).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
            this.loadProducts();
          }
        })
      }
    });
  }
}
