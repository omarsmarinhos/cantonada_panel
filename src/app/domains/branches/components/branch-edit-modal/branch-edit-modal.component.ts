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
import { GoogleMap, MapAdvancedMarker, MapGeocoder } from '@angular/google-maps';
import { MatGridListModule } from '@angular/material/grid-list';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TimeService } from '../../../shared/services/promotion/time.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BranchService } from '../../../shared/services/branch.service';
import { AuthService } from '../../../shared/services/auth.service';

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
    MapAdvancedMarker,
    MatGridListModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatProgressBarModule
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
  private readonly timeService = inject(TimeService);
  private readonly branchService = inject(BranchService);
  private readonly authService = inject(AuthService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSubscription: Subscription | undefined;

  form: FormGroup;
  colspan3: number = 12;
  colspanId: number = 10;
  colspanBtn: number = 2;
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
  mapOptions: google.maps.MapOptions = { streetViewControl: false, mapTypeControl: false };
  markerPosition = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  geocoder = inject(MapGeocoder);

  times: string[] = [];
  filteredStartTimes: string[] = [];
  filteredEndTimes: string[] = [];

  isDataFastLoading: boolean = false;
  isSynchronizedWithFast = this.authService.isSynchronizedWithFast();

  constructor() {
    this.form = this.fb.group({
      iIdSucursal: [this.branch.iIdSucursal],
      tNombre: [this.branch.tNombre, [
        Validators.required,
        Validators.pattern(/\S+/)
      ]],
      tDireccion: [this.branch.tDireccion, [
        Validators.required,
        Validators.pattern(/\S+/)
      ]],
      tDireccionGoogle: [this.branch.tDireccionGoogle],
      jLatLng: [this.branch.jLatLng, [
        Validators.required
      ]],
      tRuc: [this.branch.tRuc, [
        Validators.required,
        Validators.pattern(/^\d{11}$/)
      ]],
      tRazonSocial: [this.branch.tRazonSocial, [
        Validators.required
      ]],
      tTelefono: [this.branch.tTelefono, [
        Validators.required,
        Validators.pattern(/^\d{9}$/)
      ]],
      hHoraInicio: [this.timeService.convertTo12HourFormat(this.branch.hHoraInicio), [
        Validators.required,
        Validators.pattern(this.timeService.timePattern)
      ]],
      hHoraFin: [this.timeService.convertTo12HourFormat(this.branch.hHoraFin), [
        Validators.required,
        Validators.pattern(this.timeService.timePattern)
      ]],
      iIdSucursalFast: [{value: this.branch.iIdSucursalFast, disabled: !this.isSynchronizedWithFast}, [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^\d+$/)
      ]],
      iIdFormatoOrden: [{value: this.branch.iIdFormatoOrden, disabled: !this.isSynchronizedWithFast}, [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^\d+$/)
      ]],
      tSerieBoleta: [{value: this.branch.tSerieBoleta, disabled: !this.isSynchronizedWithFast}, [
        Validators.required,
      ]],
      tSerieFactura: [{value: this.branch.tSerieFactura, disabled: !this.isSynchronizedWithFast}, [
        Validators.required,
      ]],
    });
    this.previewUrl = this.branch.tImagenUrl;
    this.markerPosition.set(JSON.parse(this.branch.jLatLng));
    this.center.set(JSON.parse(this.branch.jLatLng));
  }

  ngOnInit() {
    this.generateTimes();
    this.loadConfigImagen();
    this.breakpointSubscription = this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state: BreakpointState) => {
      this.colspan3 = state.matches ? 4 : 12;
      this.colspanId = state.matches ? 3 : 9;
      this.colspanBtn = state.matches ? 1 : 3;
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
    this.previewUrl = this.branch.tImagenUrl;
    this.imageChanged = false;
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

      this.alertService.showWarning("Debe corregir los campos.");
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
    
    this.form.patchValue({
      hHoraInicio: horaInicio24,
      hHoraFin: horaFin24,
    })
    const result = {
      ...this.form.value,
      imagen: this.selectedFile,
      imageChanged: this.imageChanged,
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

  loadDataFast() {
    const { tRuc, iIdSucursalFast} = this.form.value;

    if (!tRuc || !iIdSucursalFast) {
      this.alertService.showWarning("Para sincronizar debe ingresar un RUC y el Id de la sucursal de Fast");
      return;
    }

    const { iIdFormatoOrden, tSerieBoleta, tSerieFactura} = this.form.controls;

    this.isDataFastLoading = true;
    this.branchService.getDataFast(tRuc, iIdSucursalFast).subscribe({
      next: (res) => {
        this.isDataFastLoading = false;
        iIdFormatoOrden.setValue(res.iIdFormatoPedido);
        tSerieBoleta.setValue(res.tSerieBoleta);
        tSerieFactura.setValue(res.tSerieFactura);
      },
      error: (err) => {
        this.isDataFastLoading = false;
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
