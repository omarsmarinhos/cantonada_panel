import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { AlertService } from '../../../shared/services/alert.service';
import { Branch } from '../../../shared/models/Branch.model';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { ConfigurationService } from '../../../shared/services/configuration.service';
import { ConfigImagen } from '../../../shared/models/ConfigImagen.model';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';

@Component({
  selector: 'app-branch-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxFileDropModule,
    MatIconModule,
    GoogleMap,
    MapAdvancedMarker
  ],
  templateUrl: './branch-edit-modal.component.html',
  styleUrl: './branch-edit-modal.component.scss'
})
export class BranchEditModalComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<BranchEditModalComponent>);
  private readonly alertService = inject(AlertService);
  private readonly branch = inject<Branch>(MAT_DIALOG_DATA);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly configService = inject(ConfigurationService);

  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  imageChanged: boolean = false;
  configImagen: ConfigImagen = {
    iIdConfigImagen: 0,
    tTipoImagen: '',
    maxWidth: 0,
    maxHeight: 0,
    aspectRatio: ''
  };
  aspectRatioWidth: number = 0;
  aspectRatioHeight: number = 0;

  center = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  mapOptions: google.maps.MapOptions = {streetViewControl: false, mapTypeControl: false};
  markerPosition = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  geocoder = new google.maps.Geocoder();

  constructor() {
    this.form = this.fb.group({
      iIdSucursal: [this.branch.iIdSucursal],
      tNombre: [this.branch.tNombre, [Validators.required, Validators.pattern(/\S+/)]],
      tDireccion: [this.branch.tDireccion, [Validators.required, Validators.pattern(/\S+/)]],
      tDireccionGoogle: [this.branch.tDireccionGoogle],
      jLatLng: [this.branch.jLatLng, [Validators.required]]
    });
    this.previewUrl = this.branch.tImagenUrl;
    this.markerPosition.set(JSON.parse(this.branch.jLatLng));
    this.center.set(JSON.parse(this.branch.jLatLng));
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
    this.previewUrl = this.branch.tImagenUrl;
    this.imageChanged = false;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.alertService.showWarning("Debe llenar todos nombre.");
      console.log(this.form.value)
      return;
    }

    const result = {
      ...this.form.value,
      imagen: this.selectedFile,
      imageChanged: this.imageChanged,
    }
    console.log(result);
    this.dialogRef.close(result);
  }

  loadConfigImagen() {
    this.configService.getConfigImagen('Sucursal').subscribe({
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

  geocodeAddress() {
    const address = this.form.get('tDireccion')?.value;
    if (!address) return;

    const geocoderRequest: google.maps.GeocoderRequest = {
      address: address,
      componentRestrictions: {
        country: 'PE',
        locality: 'Chimbote'
      }
    };

    this.geocoder.geocode(geocoderRequest, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
        const location = results[0].geometry.location;
        const newPosition = {
          lat: location.lat(),
          lng: location.lng()
        };

        this.center.set(newPosition);
        this.markerPosition.set(newPosition);
        this.form.get('jLatLng')?.setValue(JSON.stringify(this.markerPosition()));
        this.form.get('tDireccionGoogle')?.setValue(results[0].formatted_address);
      } else {
        this.alertService.showError('Dirección no encontrada en Chimbote, Perú');
      }
    });
  }

  onMarkerDragEnd(event: google.maps.MapMouseEvent) {
    const newPos = event.latLng;
    if (newPos) {
      this.markerPosition.set({
        lat: newPos.lat(),
        lng: newPos.lng()
      });

      this.geocoder.geocode(
        { location: newPos },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
            this.form.get('tDireccionGoogle')?.setValue(results[0].formatted_address);
            this.form.get('jLatLng')?.setValue(JSON.stringify(this.markerPosition()));
            console.log(this.form.get('jLatLng')?.value);
          }
        }
      );
    }
  }
}
