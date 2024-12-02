import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { AlertService } from '../../../shared/services/alert.service';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../../shared/services/category.service';
import { Category } from '../../../shared/models/Category.model';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
import { MatGridListModule } from '@angular/material/grid-list';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { BranchService } from '../../../shared/services/branch.service';
import { Branch } from '../../../shared/models/Branch.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { ConfigImagen } from '../../../shared/models/ConfigImagen.model';
import { ConfigurationService } from '../../../shared/services/configuration.service';

@Component({
  selector: 'app-product-add',
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
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.scss'
})
export class ProductAddModalComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ProductAddModalComponent>);
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly categoryService = inject(CategoryService);
  private readonly branchService = inject(BranchService);
  private readonly configService = inject(ConfigurationService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSubscription: Subscription | undefined;

  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  categoriesSelect = signal<Category[]>([]);
  branchesChecks = signal<Branch[]>([]);
  colspan: number = 12;
  colspan3: number = 12;
  selectedBranchIds: number[] = [];
  configImagen: ConfigImagen = {
    iIdConfigImagen: 0,
    tTipoImagen: '',
    maxWidth: 0,
    maxHeight: 0,
    aspectRatio: ''
  };
  aspectRatioWidth: number = 0;
  aspectRatioHeight: number = 0;

  constructor() {
    this.form = this.fb.group({
      tNombre: ['', [Validators.required, Validators.pattern(/\S+/)]],
      dPrecio: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(9999.99),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      tDescripcion: ['', [Validators.required, Validators.pattern(/\S+/)]],
      lDelivery: [true, [Validators.required]],
      lRecoger: [true, [Validators.required]],
      lPopular: [false, [Validators.required]],
      lNovedad: [false, [Validators.required]],
      lAdicional: [false, [Validators.required]],
      iAdicionalesGratis: [0, [Validators.required, Validators.min(0)]],
      iIdProductoFast: [0, [Validators.required, Validators.min(0)]],
      iIdCategoria: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadCategoriesInSelect();
    this.loadBranchesChecks();
    this.loadConfigImagen();
    this.breakpointSubscription = this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.colspan = 6;
        this.colspan3 = 4
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
    this.previewUrl = null;
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

      if (this.form.get('dPrecio')?.hasError('min') || this.form.get('dPrecio')?.hasError('max')) {
        this.alertService.showWarning("El precio debe ser mayor o igual que 1 y menor que 10000.00");
        return;
      }

      if (this.form.get('iAdicionalesGratis')?.hasError('min') || this.form.get('iIdProductoFast')?.hasError('min')) {
        this.alertService.showWarning("Solo números positivos.");
        return;
      }

      this.form.markAllAsTouched();
      this.alertService.showWarning("Debe llenar todos los campos.");
      return;
    }

    if (!this.selectedFile) {
      this.alertService.showWarning("Debe agregar una imagen.");
      return;
    }

    this.dialogRef.close({
      tNombre: this.form.get('tNombre')?.value.trim(),
      tDescripcion: this.form.get('tDescripcion')?.value.trim(),
      dPrecio: this.form.get('dPrecio')?.value,
      lDelivery: this.form.get('lDelivery')?.value,
      lRecoger: this.form.get('lRecoger')?.value,
      lPopular: this.form.get('lPopular')?.value,
      lNovedad: this.form.get('lNovedad')?.value,
      lAdicional: this.form.get('lAdicional')?.value,
      iAdicionalesGratis: this.form.get('iAdicionalesGratis')?.value,
      iIdProductoFast: this.form.get('iIdProductoFast')?.value,
      iIdCategoria: this.form.get('iIdCategoria')?.value,
      sucursales: this.selectedBranchIds,
      imagen: this.selectedFile,
    });
  }

  loadCategoriesInSelect() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categoriesSelect.set(res);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    })
  }

  loadBranchesChecks() {
    this.branchService.getSucursal().subscribe({
      next: (res) => {
        this.branchesChecks.set(res);
        this.selectedBranchIds = res.map(branch => branch.iIdSucursal);
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

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  loadConfigImagen() {
    this.configService.getConfigImagen('Producto').subscribe({
      next: (res) => {
        this.configImagen = res;
        const parts = this.configImagen.aspectRatio.split(":");
        this.aspectRatioWidth = parseInt(parts[0]);
        this.aspectRatioHeight = parseInt(parts[1]);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }
}
