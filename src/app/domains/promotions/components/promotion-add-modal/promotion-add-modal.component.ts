import { CommonModule } from '@angular/common';
import { Component, effect, HostListener, inject, input, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { debounceTime, Subscription } from 'rxjs';
import { ConfigImagen } from '../../../shared/models/ConfigImagen.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { PromotionService } from '../../../shared/services/promotion.service';

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
    MatAutocompleteModule,
    MatListModule
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
  private readonly promotionService = inject(PromotionService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSubscription: Subscription | undefined;
  private tTipoAplicacionSubscription: Subscription | undefined;
  private tTipoAplicarSubscription: Subscription | undefined;
  private subscriptions: { [key: string]: Subscription | undefined } = {};

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

  details = signal<{ id: number, nombre: string, line?: number }[]>([])
  searchControl = new FormControl();
  searchTerm = signal('');
  filteredOptions = signal<any[]>([]);
  symbol = '';

  constructor() {
    this.form = this.fb.group({
      tNombre: ['', [Validators.required, Validators.pattern(/\S+/)]],
      tEnlace: ['', [Validators.pattern(/\S+/)]],
      lPorFecha: [false, [Validators.required]],
      fFechaInicio: [{ value: '', disabled: true }, [Validators.required]],
      fFechaFin: [{ value: '', disabled: true }, [Validators.required]],
      lPorHora: [false, [Validators.required]],
      hHoraInicio: [{ value: '', disabled: true }, [Validators.required]],
      hHoraFin: [{ value: '', disabled: true }, [Validators.required]],
      lPorImporte: [false, [Validators.required]],
      dImporteMin: [{ value: '', disabled: true }, [Validators.required]],
      dImporteMax: [{ value: '', disabled: true }, [Validators.required]],
      tTipoAplicacion: ['', [Validators.required]],
      tTipoAplicar: ['', [Validators.required]],
      dValorAplicar: [{ value: '', disabled: true }, [Validators.required]],
      tDescripcion: ['', [Validators.pattern(/\S+/)]],
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(value => {
      this.searchTerm.set(value || '');
    });

    effect(() => {
      const value = this.searchTerm();
      if (value.length > 2) {
        this.promotionService.search(value, this.form.get('tTipoAplicacion')?.value).subscribe({
          next: (res) => this.filteredOptions.set(res),
          error: (err) => console.error(err)
        });
      } else {
        this.filteredOptions.set([]);
      }
    }, { allowSignalWrites: true });
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
    this.onChangesSlidesToggle();

    this.searchControl.disable();
    this.tTipoAplicacionSubscription = this.form.get('tTipoAplicacion')?.valueChanges.subscribe(value => {
      this.handleTipoAplicacionChange(value);
    });

    this.tTipoAplicarSubscription = this.form.get('tTipoAplicar')?.valueChanges.subscribe(value => {
      this.handleTipoAplicarChange(value);
    });
  }

  onChangesSlidesToggle() {
    const toggleConfigs = [
      {
        control: 'lPorFecha',
        fieldsToToggle: ['fFechaInicio', 'fFechaFin']
      },
      {
        control: 'lPorHora',
        fieldsToToggle: ['hHoraInicio', 'hHoraFin']
      },
      {
        control: 'lPorImporte',
        fieldsToToggle: ['dImporteMin', 'dImporteMax']
      }
    ];

    toggleConfigs.forEach(config => {
      this.subscriptions[config.control] = this.form.get(config.control)?.valueChanges.subscribe((value) => {
        config.fieldsToToggle.forEach(field => {
          const formControl = this.form.get(field);
          if (value === false) {
            formControl?.disable();
            formControl?.setValue('');
          } else {
            formControl?.enable();
          }
        });
      });
    });
  }

  handleTipoAplicacionChange(value: string) {
    this.details.set([]);
    if (value === 'producto') {
      this.searchControl.enable();
    } else if (value === 'categoría') {
      this.searchControl.enable();
    } else {
      this.searchControl.disable();
    }
  }

  handleTipoAplicarChange(value: string) {
    if (value === 'descuento importe') {
      this.form.get('dValorAplicar')?.enable();
      this.symbol = 'S/';
    } else if (value === 'descuento porcentaje') {
      this.form.get('dValorAplicar')?.enable();
      this.symbol = '%';
    } else if (value === 'delivery gratis') {
      this.form.get('dValorAplicar')?.disable();
      this.symbol = '';
    } else if (value === 'delivery descuento') {
      this.form.get('dValorAplicar')?.enable();
      this.symbol = 'S/';
    } else {
      this.form.get('dValorAplicar')?.disable();
      this.symbol = '';
    }
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
    if (this.form.invalid) {
      const tNombreError = this.form.get('tNombre')?.getError('pattern');
      const tEnlaceError = this.form.get('tEnlace')?.getError('pattern');
      const tDescripcionError = this.form.get('tDescripcion')?.getError('pattern');

      if (tNombreError || tEnlaceError || tDescripcionError) {
        this.alertService.showWarning("No debe ingresar solo espacios en blanco.");
        return;
      }

      this.form.markAllAsTouched();
      this.alertService.showWarning("Debe llenar todos los campos");
      return;
    }

    const lPorFecha = this.form.get('lPorFecha')?.value;
    const lPorHora = this.form.get('lPorHora')?.value;
    const lPorImporte = this.form.get('lPorImporte')?.value;

    if (!lPorFecha && !lPorHora && !lPorImporte) {
      this.alertService.showWarning("Debe seleccionar por lo menos uno de los rangos.");
      return;
    }

    if (lPorFecha) {
      const dateInicio = new Date(this.form.get('fFechaInicio')?.value);
      const dateFin = new Date(this.form.get('fFechaFin')?.value);
      if (dateInicio.getTime() === dateFin.getTime() || dateFin.getTime() < dateInicio.getTime()) {
        this.alertService.showWarning("La fecha de fin no puede ser igual o mayor a la fecha de inicio.");
        return;
      }
    }

    if (lPorFecha) {
      const dateInicio = new Date(this.form.get('fFechaInicio')?.value);
      const dateFin = new Date(this.form.get('fFechaFin')?.value);
      if (dateInicio.getTime() === dateFin.getTime() || dateFin.getTime() < dateInicio.getTime()) {
        this.alertService.showWarning("La fecha de fin no puede ser igual o mayor a la fecha de inicio.");
        return;
      }
    }

    this.alertService.showSuccess("OK");
    this.submit();
  }

  submit() {
    const idsFromDetails = this.details().map(item => item.id);
    const imagen = this.selectedFile;
    const result = {
      ...this.form.value,
      idsFromDetails,
      imagen
    }
    console.log(result);
    // this.dialogRef.close(result);
  }

  onCancel(): void {
    this.dialogRef.close();
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

  removeFromListDetails(index: number) {
    this.details.update(details => details.filter((_, i) => i !== index));
    console.log(this.details());
  }

  addItem() {
    const selectedItem = this.searchControl.value;
    if (!selectedItem) {
      this.alertService.showWarning("Primero debe buscar un item.")
      return;
    }

    const isDuplicate = this.details().some(item => item.id === selectedItem.id);

    if (isDuplicate) {
      this.alertService.showWarning("Este item ya se encuentra agregado.")
      return;
    }

    this.details.update(details => [...details, {
      id: selectedItem.id,
      nombre: selectedItem.nombre
    }]);
    this.searchControl.setValue('');
  }

  displayFn(item?: { id: number, nombre: string }): string {
    return item ? item.nombre : '';
  }

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
    if (this.tTipoAplicacionSubscription) {
      this.tTipoAplicacionSubscription.unsubscribe();
    }
    if (this.tTipoAplicarSubscription) {
      this.tTipoAplicarSubscription.unsubscribe();
    }
    Object.values(this.subscriptions).forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }
}
