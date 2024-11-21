import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
import { MatGridListModule } from '@angular/material/grid-list';
import { AlertService } from '../../../shared/services/alert.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { ConfigurationService } from '../../../shared/services/configuration.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { ConfigImagen } from '../../../shared/models/ConfigImagen.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-promotion-add-modal',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxFileDropModule,
    MatIconModule,
    MatSelectModule,
    CapitalizePipe,
    MatGridListModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatAutocompleteModule
  ],
  templateUrl: './promotion-add-modal.component.html',
  styleUrl: './promotion-add-modal.component.scss'
})
export class PromotionAddModalComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<this>);
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly configService = inject(ConfigurationService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSubscription: Subscription | undefined;

  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  colspan: number = 12;
  colspanBy: number = 12;
  configImagen: ConfigImagen = {
    iIdConfigImagen: 0,
    tTipoImagen: '',
    maxWidth: 0,
    maxHeight: 0,
    aspectRatio: ''
  };
  aspectRatioWidth: number = 0;
  aspectRatioHeight: number = 0;

  aplicacionSelect: string[] = ['producto', 'categoría', 'todo'];
  aplicarSelect: string[] = ['descuento importe', 'descuento porcentaje', 'delivery gratis', 'delivery descuento'];
  times: string[] = [];
  filteredStartTimes: string[] = [];
  filteredEndTimes: string[] = [];

  constructor() {
    this.form = this.fb.group({
      tNombre: ['', [Validators.required, Validators.pattern(/\S+/)]],
      tEnlace: ['', [Validators.pattern(/\S+/)]],
      lPorFecha: ['', [Validators.required]],
      fFechaInicio: ['', []],
      fFechaFin: ['', []],
      lPorHora: ['', [Validators.required]],
      hHoraInicio: ['', []],
      hHoraFin: ['', []],
      lPorImporte: ['', [Validators.required]],
      dImporteMin: ['', []],
      dImporteMax: ['', []],
      tTipoAplicacion: ['', [Validators.required]],
      tTipoAplicar: ['', [Validators.required]],
      dValorAplicar: ['', [Validators.required]],
      tDescripcion: ['', [Validators.pattern(/\S+/)]],
    });
  }

  ngOnInit() {
    this.loadConfigImagen();
    this.generateTimes();
    this.filteredStartTimes = [...this.times];
    this.filteredEndTimes = [...this.times];
    this.breakpointSubscription = this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.colspan = 6;
        this.colspanBy = 4;
      } else {
        this.colspan = 12;
        this.colspanBy = 12;
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

  onSubmit() {

  }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  loadConfigImagen() {
    this.configService.getConfigImagen('Promoción').subscribe({
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

  generateTimes(): void {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = ['00'];
    this.times = [];

    hours.forEach((hour) => {
      minutes.forEach((minute) => {
        const formattedHour = String(hour % 12 || 12).padStart(2, '0');
        const amPm = hour < 12 ? 'AM' : 'PM';
        this.times.push(`${formattedHour}:${minute} ${amPm}`);
      });
    });
  }

  filterTimes(controlName: string): void {
    const inputValue = this.form.get(controlName)?.value?.toLowerCase() || '';
    if (controlName === 'hHoraInicio') {
      this.filteredStartTimes = this.times.filter((time) =>
        time.toLowerCase().includes(inputValue)
      );
    } else if (controlName === 'hHoraFin') {
      this.filteredEndTimes = this.times.filter((time) =>
        time.toLowerCase().includes(inputValue)
      );
    }
  }
}
