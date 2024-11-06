import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { AlertService } from '../../../shared/services/alert.service';
import { Category } from '../../../shared/models/Category.model';

@Component({
  selector: 'app-category-edit-modal',
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
  templateUrl: './category-edit-modal.component.html',
  styleUrl: './category-edit-modal.component.scss'
})
export class CategoryEditModalComponent {

  readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<CategoryEditModalComponent>);
  readonly alertService = inject(AlertService);
  readonly category = inject<Category>(MAT_DIALOG_DATA);

  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  imageChanged: boolean = false;

  constructor() {
    this.form = this.fb.group({
      tNombre: [this.category.tNombre, [Validators.required, Validators.pattern(/\S+/)]],
      lPrincipal: [this.category.lPrincipal, [Validators.required]]
    });
    this.previewUrl = this.category.tImagenUrl;
    console.log(this.category);
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

          this.selectedFile = file;
          this.imageChanged = true;

          const reader = new FileReader();
          reader.onload = () => {
            this.previewUrl = reader.result;
          };
          reader.readAsDataURL(file);
        });
      }
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.previewUrl = this.category.tImagenUrl;
    this.imageChanged = false;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.alertService.showWarning("Debe ingresar un nombre.");
      return;
    }

    this.dialogRef.close({
      iIdCategoria: this.category.iIdCategoria,
      tNombre: this.form.get('tNombre')?.value,
      lPrincipal: this.form.get('lPrincipal')?.value,
      imageChanged: this.imageChanged,
      imagen: this.selectedFile,
    });
  }
}
