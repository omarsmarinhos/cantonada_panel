import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { AlertService } from '../../../shared/services/alert.service';
import { ConfigurationService } from '../../../shared/services/configuration.service';
import { ConfigImagen } from '../../../shared/models/ConfigImagen.model';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';

@Component({
  selector: 'app-category-add-modal',
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
    MatIconModule
  ],
  templateUrl: './category-add-modal.component.html',
  styleUrl: './category-add-modal.component.scss'
})
export class CategoryAddModalComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CategoryAddModalComponent>);
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly configService = inject(ConfigurationService);

  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
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
      lPrincipal: [false, [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadConfigImagen();
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
      this.alertService.showWarning("Debe ingresar un nombre.");
      return;
    }

    if (!this.selectedFile) {
      this.alertService.showWarning("Debe agregar una imagen.");
      return;
    }

    this.dialogRef.close({
      tNombre: this.form.get('tNombre')?.value.trim(),
      lPrincipal: this.form.get('lPrincipal')?.value,
      imagen: this.selectedFile,
    });
  }

  loadConfigImagen() {
    this.configService.getConfigImagen('Categoría').subscribe({
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
