import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '../../../shared/services/alert.service';
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
import {
  Branch
} from '../../../shared/models/Branch.model';
import { Product } from '../../../shared/models/Product.model';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { ConfigImagen } from '../../../shared/models/ConfigImagen.model';
import { ProductService } from '../../../shared/services/product.service';
import { UnitMeasure } from '../../../shared/models/unit-measure.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

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
    MatCheckboxModule,
    MatAutocompleteModule
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ProductEditComponent>);
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly productService = inject(ProductService);
  private readonly data = inject<{
    product: Product,
    categories: Category[],
    units: UnitMeasure[],
    branches: Branch[],
    configImagen: ConfigImagen
  }>(MAT_DIALOG_DATA);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSubscription: Subscription | undefined;

  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  categoriesSelect = signal<Category[]>([]);
  branchesChecks = signal<Branch[]>([]);
  units = signal<UnitMeasure[]>([]);
  filteredUnits = signal<UnitMeasure[]>([]);
  colspan: number = 12;
  colspan3: number = 12;
  selectedBranchIds: number[] = [];
  imageChanged: boolean = false;
  configImagen: ConfigImagen;
  aspectRatioWidth: number = 0;
  aspectRatioHeight: number = 0;

  constructor() {
    this.form = this.fb.group({
      tNombre: [this.data.product.tNombre, [
        Validators.required, 
        Validators.pattern(/\S+/)
      ]],
      dPrecio: [this.data.product.dPrecio, [
        Validators.required,
        Validators.min(1),
        Validators.max(9999.99),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      tDescripcion: [this.data.product.tDescripcion, [
        Validators.required, 
        Validators.pattern(/\S+/)
      ]],
      lDelivery: [this.data.product.lDelivery, [Validators.required]],
      lRecoger: [this.data.product.lRecoger, [Validators.required]],
      lPopular: [this.data.product.lPopular, [Validators.required]],
      lNovedad: [this.data.product.lNovedad, [Validators.required]],
      lAdicional: [this.data.product.lAdicional, [Validators.required]],
      iAdicionalesGratis: [this.data.product.iAdicionalesGratis, [
        Validators.required,
        Validators.min(0)
      ]],
      iIdProductoFast: [this.data.product.iIdProductoFast, [
        Validators.required, 
        Validators.min(0)
      ]],
      iIdCategoria: [this.data.product.categoria.iIdCategoria, [Validators.required]],
      tUnidadMedida: [this.data.product.tUnidadMedida, [
        Validators.required, 
        this.validOption()
      ]],
      iIdProducto: [this.data.product.iIdProducto]
    });
    this.previewUrl = this.data.product.tImagenUrl;
    this.branchesChecks.set(this.data.branches);
    this.selectedBranchIds = JSON.parse(this.data.product.jSucursales);
    this.categoriesSelect.set(this.data.categories);
    this.units.set(this.data.units);
    this.filteredUnits.set(this.units());
    this.configImagen = this.data.configImagen;
    const parts = this.configImagen.aspectRatio.split(":");
    this.aspectRatioWidth = parseInt(parts[0]);
    this.aspectRatioHeight = parseInt(parts[1]);
  }

  ngOnInit() {
    this.breakpointSubscription = this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.colspan = 8;
        this.colspan3 = 4;
      } else {
        this.colspan = 12;
        this.colspan3 = 12;
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

            if (width > this.configImagen.maxWidth || height > this.configImagen.maxHeight) {
              this.alertService.showError(`La imagen excede las dimensiones permitidas de ${this.configImagen.maxWidth}x${this.configImagen.maxHeight} píxeles.`);
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
    this.previewUrl = this.data.product.tImagenUrl;
    this.imageChanged = false;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      if (this.form.get('dPrecio')?.hasError('pattern')) {
        this.alertService.showWarning("Formato incorrecto en el precio");
        return;
      }

      if (this.form.get('dPrecio')?.hasError('min') || this.form.get('dPrecio')?.hasError('max')) {
        this.alertService.showWarning("El precio debe ser mayor o igual que 1 y menor que 10000.00");
        return;
      }

      if (this.form.get('iAdicionalesGratis')?.hasError('min') || this.form.get('iIdProductoFast')?.hasError('min')) {
        this.alertService.showWarning("Solo números positivos.");
        return;
      }

      if (this.form.get('tUnidadMedida')?.hasError('invalidOption')) {
        this.alertService.showWarning("Debe seleccionar una opción válida en la unidad de medida.");
        return;
      }

      this.alertService.showWarning("Debe llenar todos los campos.");
      return;
    }

    const data = {
      ...this.form.value,
      tNombre: this.form.get('tNombre')?.value.trim(),
      tDescripcion: this.form.get('tDescripcion')?.value.trim(),
      sucursales: this.selectedBranchIds,
      imageChanged: this.imageChanged,
      imagen: this.selectedFile,
    };

    this.productService.editProduct(data).subscribe({
      next: (res) => {
        this.alertService.showSuccess(res.mensaje);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.errorService.showError(err);
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

  filterUnits(controlName: string): void {
      const inputValue = this.form.get(controlName)?.value?.toLowerCase() || '';
      this.filteredUnits.set(
        this.units().filter(unit =>
          unit.tCodigo.toLowerCase().includes(inputValue) ||
          unit.tDescripcion.toLowerCase().includes(inputValue)
        )
      );
    }
  
    validOption(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        const exists = this.units().some(unit => unit.tCodigo === value);
        return exists ? null : { invalidOption: true };
      };
    }

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }
}
