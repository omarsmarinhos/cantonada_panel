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
import { ProductAdditionalComponent } from './components/product-additional/product-additional.component';
import { ProductAdditionalService } from '../shared/services/additional.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { Router } from '@angular/router';
import { PaginatedRequest } from '../shared/models/paginated-request.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { PaginationComponent } from "../customers/components/pagination/pagination.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MatIconModule,
    ProductCardComponent,
    CapitalizePipe,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    PaginationComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export default class ProductsComponent {

  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly additionalService = inject(ProductAdditionalService);
  private readonly alertService = inject(AlertService);
  private readonly dialog = inject(MatDialog);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly router = inject(Router);

  categories = signal<Category[]>([]);
  selectedCategory: string = 'Todos';

  products = signal<Product[]>([])
  totalItems = signal(0);
  selectedOrder: string = '';
  currentPage: number = 1;
  searchQuery: string = '';

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }

  changeCategory(category: string) {
    this.selectedCategory = category;
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadProducts();
  }

  loadProducts() {
    const request: PaginatedRequest = {
      tCategoria: this.selectedCategory,
      iPageNumber: this.currentPage,
      iPageSize: 12,
      tSort: this.selectedOrder,
      tSearch: this.searchQuery
    }
    this.productService.getProducts(request).subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.totalItems.set(res.totalRecords);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    })
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadProducts();
  }

  onOrderChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadProducts();
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
            this.errorService.showError(err);
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
        this.productService.editProduct(result).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
            this.loadProducts();
          },
          error: (err) => {
            this.errorService.showError(err);
          }
        })
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
          },
          error: (err) => {
            this.errorService.showError(err);
          }
        })
      }
    });
  }

  onAddAdditional(product: Product) {
    const dialogRef = this.dialog.open(ProductAdditionalComponent, {
      width: '900px',
      data: product
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.additionalService.assign(result).subscribe({
          next: (res) => {
            this.alertService.showSuccess(res.mensaje);
          },
          error: (err) => {
            this.errorService.showError(err);
          }
        })
      }
    });
  }

  goToSortProductsPage() {
    this.router.navigate(["/orden-productos"]);
  }
}
