import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { AlertService } from '../../../shared/services/alert.service';
import { ConfigImagen } from '../../../shared/models/ConfigImagen.model';
import { ConfigurationService } from '../../../shared/services/configuration.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { GoogleMap, MapAdvancedMarker, MapGeocoder } from '@angular/google-maps';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TimeService } from '../../../shared/services/promotion/time.service';

@Component({
  selector: 'app-branch-add-modal',
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
    GoogleMap,
    MapAdvancedMarker,
    MatGridListModule,
    MatDatepickerModule,
    MatAutocompleteModule,
  ],
  templateUrl: './branch-add-modal.component.html',
  styleUrl: './branch-add-modal.component.scss'
})
export class BranchAddModalComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<BranchAddModalComponent>);
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly configService = inject(ConfigurationService);
  private readonly timeService = inject(TimeService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSubscription: Subscription | undefined;

  form: FormGroup;
  colspan3: number = 12;
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

  center = signal<google.maps.LatLngLiteral>({ lat: -9.100386565771842, lng: -78.54360101264027 });
  mapOptions: google.maps.MapOptions = { streetViewControl: false, mapTypeControl: false };
  markerPosition = signal<google.maps.LatLngLiteral>({ ...this.center() });
  geocoder = inject(MapGeocoder);

  times: string[] = [];
  filteredStartTimes: string[] = [];
  filteredEndTimes: string[] = [];

  constructor() {
    this.form = this.fb.group({
      tNombre: ['', [Validators.required, Validators.pattern(/\S+/)]],
      tDireccion: ['', [Validators.required, Validators.pattern(/\S+/)]],
      tDireccionGoogle: [''],
      jLatLng: ['', [Validators.required]],
      iIdSucursalFast: ['', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^\d+$/)
      ]],
      tRuc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      tRazonSocial: ['', [Validators.required]],
      tTelefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      hHoraInicio: ['', [Validators.required, Validators.pattern(this.timeService.timePattern)]],
      hHoraFin: ['', [Validators.required, Validators.pattern(this.timeService.timePattern)]],
    });
  }

  ngOnInit() {
    this.generateTimes();
    this.loadConfigImagen();
    this.breakpointSubscription = this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state: BreakpointState) => {
      this.colspan3 = state.matches ? 4 : 12;
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
      this.form.markAllAsTouched();

      if (this.form.get('iIdSucursalFast')?.hasError('min') || this.form.get('iIdSucursalFast')?.hasError('pattern')) {
        this.alertService.showWarning("EL Id de Fast debe ser solo números positivos.");
        return;
      }

      const hasRucError = this.form.get("tRuc")?.hasError('pattern');
      const hasTelefonoError = this.form.get("tTelefono")?.hasError('pattern');

      if (hasRucError) {
        this.alertService.showWarning("El ruc debe tener 11 dígitos.");
        return;
      }

      if (hasTelefonoError) {
        this.alertService.showWarning("El teléfono debe tener 9 dígitos.");
        return;
      }

      const tDireccionGoogle = this.form.get('tDireccionGoogle')?.value;
      if (!tDireccionGoogle) {
        this.alertService.showWarning("Debe arrastrar el marcador en el mapa.");
        return;
      }

      this.alertService.showWarning("Debe llenar los campos.");
      return;
    }

    const horaInicio = this.form.get('hHoraInicio')?.value;
    const horaFin = this.form.get('hHoraFin')?.value;

    const horaInicio24 = this.timeService.convertTo24HourFormat(horaInicio);
    const horaFin24 = this.timeService.convertTo24HourFormat(horaFin);

    if (horaFin24 <= horaInicio24) {
      this.alertService.showWarning("La hora de fin no puede ser igual o menor a la hora de inicio.");
      return;
    }

    if (!this.selectedFile) {
      this.alertService.showWarning("Debe agregar una imagen.");
      return;
    }
    this.form.patchValue({
      hHoraInicio: horaInicio24,
      hHoraFin: horaFin24,
    })
    const result = {
      ...this.form.value,
      imagen: this.selectedFile
    }
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

    this.geocoder.geocode(geocoderRequest).subscribe(({ results, status }) => {
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
      this.geocoder.geocode({ location: newPos }).subscribe(({ results, status }) => {
        if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
          this.form.get('tDireccionGoogle')?.setValue(
            results[0].formatted_address
          );
          this.form.get('jLatLng')?.setValue(JSON.stringify(this.markerPosition()));
        }
      }
      );
    }
  }

  generateTimes(): void {
    this.times = this.timeService.generateTimes();
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

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }
}
