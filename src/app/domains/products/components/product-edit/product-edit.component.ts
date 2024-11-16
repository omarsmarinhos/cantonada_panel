import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '../../../shared/services/alert.service';
import { CategoryService } from '../../../shared/services/category.service';
import { BranchService } from '../../../shared/services/branch.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Category } from '../../../shared/models/Category.model';
import { Branch
 } from '../../../shared/models/Branch.model';
import { Product } from '../../../shared/models/Product.model';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    NgxFileDropModule,
    MatIconModule,
    MatSelectModule,
    CapitalizePipe,
    MatGridListModule,
    MatCheckboxModule
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent {

  readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<ProductEditComponent>);
  readonly alertService = inject(AlertService);
  readonly categoryService = inject(CategoryService);
  readonly branchService = inject(BranchService);
  readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSubscription: Subscription | undefined;
  readonly product = inject<Product>(MAT_DIALOG_DATA);

  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  categoriesSelect = signal<Category[]>([]);
  branchesChecks = signal<Branch[]>([]);
  colspan: number = 12;
  selectedBranchIds: number[] = [];
  imageChanged: boolean = false;
  maxWidth = 900;
  maxHeight = 675;
  aspectRatioWidth = 4;
  aspectRatioHeight = 3;

  constructor() {
    this.form = this.fb.group({
      tNombre: [this.product.tNombre, [Validators.required, Validators.pattern(/\S+/)]],
      dPrecio: [this.product.dPrecio, [
        Validators.required,
        Validators.min(0),
        Validators.max(9999.99),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      tDescripcion: [this.product.tDescripcion, [Validators.required, Validators.pattern(/\S+/)]],
      lDelivery: [this.product.lDelivery, [Validators.required]],
      lRecoger: [this.product.lRecoger, [Validators.required]],
      lPopular: [this.product.lPopular, [Validators.required]],
      lNovedad: [this.product.lNovedad, [Validators.required]],
      lAdicional: [this.product.lAdicional, [Validators.required]],
      iIdCategoria: [this.product.categoria.iIdCategoria, [Validators.required]]
    });
    this.previewUrl = this.product.tImagenUrl;
    this.selectedBranchIds = JSON.parse(this.product.jSucursales);
  }

  ngOnInit() {
    this.loadCategoriesInSelect();
    this.loadBranchesChecks();
    this.breakpointSubscription = this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.colspan = 6;
      } else {
        this.colspan = 12;
      }
    });
  }

  onFileDrop(files: NgxFileDropEntry[]): void {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          if (!file.type.startsWith('image/')) {
            this.alertService.showError("Archivo no válido.");
            return;
          }

          const img = new Image();
          const objectUrl = URL.createObjectURL(file);
          img.src = objectUrl;

          img.onload = () => {
            const width = img.width;
            const height = img.height;

            if (width > this.maxWidth || height > this.maxHeight) {
              this.alertService.showError(`La imagen excede las dimensiones permitidas de ${this.maxWidth}x${this.maxHeight} píxeles.`);
              URL.revokeObjectURL(objectUrl);
              return;
            }

            const aspectRatio = width / height;
            const expectedAspectRatio = this.aspectRatioWidth / this.aspectRatioHeight;

            if (Math.abs(aspectRatio - expectedAspectRatio) > 0.01) {
              this.alertService.showError(`La imagen debe tener una proporción de ${this.aspectRatioWidth}:${this.aspectRatioHeight}.`);
              URL.revokeObjectURL(objectUrl);
              return;
            }

            this.selectedFile = file;
            this.imageChanged = true;

            const reader = new FileReader();
            reader.onload = () => {
              this.previewUrl = reader.result;
            };
            reader.readAsDataURL(file);

            URL.revokeObjectURL(objectUrl);
          };
        });
      }
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.previewUrl = this.product.tImagenUrl;
    this.imageChanged = false;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.invalid) {

      if (this.form.get('dPrecio')?.hasError('pattern')) {
        this.alertService.showWarning("Formato incorrecto en el precio");
        return;
      }

      this.form.markAllAsTouched();
      this.alertService.showWarning("Debe llenar todos los campos.");
      return;
    }

    this.dialogRef.close({
      iIdProducto: this.product.iIdProducto,
      tNombre: this.form.get('tNombre')?.value.trim(),
      tDescripcion: this.form.get('tDescripcion')?.value.trim(),
      dPrecio: this.form.get('dPrecio')?.value,
      lDelivery: this.form.get('lDelivery')?.value,
      lRecoger: this.form.get('lRecoger')?.value,
      lPopular: this.form.get('lPopular')?.value,
      lNovedad: this.form.get('lNovedad')?.value,
      lAdicional: this.form.get('lAdicional')?.value,
      iIdCategoria: this.form.get('iIdCategoria')?.value,
      sucursales: this.selectedBranchIds,
      imageChanged: this.imageChanged,
      imagen: this.selectedFile,
    });
  }

  loadCategoriesInSelect() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categoriesSelect.set(res);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  loadBranchesChecks() {
    this.branchService.getSucursal().subscribe({
      next: (res) => {
        this.branchesChecks.set(res);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  onBranchChange(iIdSucursal: number, isChecked: boolean) {
    if (isChecked) {
      if (!this.selectedBranchIds.includes(iIdSucursal)) {
        this.selectedBranchIds.push(iIdSucursal);
      }
    } else {
      this.selectedBranchIds = this.selectedBranchIds.filter(id => id !== iIdSucursal);
    }
  }

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }
}
