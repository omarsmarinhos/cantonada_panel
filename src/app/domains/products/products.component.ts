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
import { UnitMeasure } from '../shared/models/unit-measure.model';
import { BranchService } from '../shared/services/branch.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { Branch } from '../shared/models/Branch.model';
import { ConfigImagen } from '../shared/models/ConfigImagen.model';

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
  private readonly branchService = inject(BranchService);
  private readonly configService = inject(ConfigurationService);
  private readonly additionalService = inject(ProductAdditionalService);
  private readonly alertService = inject(AlertService);
  private readonly dialog = inject(MatDialog);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly router = inject(Router);

  categories = signal<Category[]>([]);
  units = signal<UnitMeasure[]>([]);
  branches = signal<Branch[]>([]);
  products = signal<Product[]>([])
  configImagen: ConfigImagen | undefined;

  selectedCategory: string = 'Todos';
  totalItems = signal(0);
  selectedOrder: string = '';
  currentPage: number = 1;
  searchQuery: string = '';

  isDataLoaded = signal<boolean>(false);

  ngOnInit() {
    this.loadUnits();
    this.loadCategories();
    this.loadProducts();
    this.loadBranches();
    this.loadConfigImagen();
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

  loadUnits() {
    this.productService.getUnits().subscribe({
      next: (res) => {
        this.units.set(res);
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
      width: '900px',
      data: {
        categories: this.categories(),
        units: this.units(),
        branches: this.branches(),
        configImagen: this.configImagen,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  onEditProduct(product: Product) {
    const dialogRef = this.dialog.open(ProductEditComponent, {
      width: '900px',
      data: {
        product: product,
        categories: this.categories(),
        units: this.units(),
        branches: this.branches(),
        configImagen: this.configImagen,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
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

  loadBranches() {
    this.branchService.getSucursal().subscribe({
      next: (res) => {
        this.branches.set(res);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }

  loadConfigImagen() {
    this.configService.getConfigImagen('Producto').subscribe({
      next: (res) => {
        this.configImagen = res;
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }
}
