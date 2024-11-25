import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { AlertService } from '../../../shared/services/alert.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { ConfigurationService } from '../../../shared/services/configuration.service';
import { ValidationService } from '../../../shared/services/promotion/validation.service';
import { TimeService } from '../../../shared/services/promotion/time.service';
import { PromotionService } from '../../../shared/services/promotion.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { debounceTime, Subscription } from 'rxjs';
import { ConfigImagen } from '../../../shared/models/ConfigImagen.model';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Promotion } from '../../../shared/models/Promotion.model';

@Component({
  selector: 'app-promotion-edit-modal',
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
  templateUrl: './promotion-edit-modal.component.html',
  styleUrl: './promotion-edit-modal.component.scss'
})
export class PromotionEditModalComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<this>);
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly configService = inject(ConfigurationService);
  private readonly validationService = inject(ValidationService);
  private readonly timeService = inject(TimeService);
  private readonly promotionService = inject(PromotionService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly promotion = inject<Promotion>(MAT_DIALOG_DATA);
  private breakpointSubscription: Subscription | undefined;
  private tTipoAplicacionSubscription: Subscription | undefined;
  private tTipoAplicarSubscription: Subscription | undefined;
  private searchControlSubscription: Subscription | undefined;
  private subscriptions: { [key: string]: Subscription | undefined } = {};

  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  colspan: number = 12;
  colspanBy: number = 12;
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
      tNombre: [this.promotion.tNombre, [Validators.required, Validators.pattern(/\S+/)]],
      tEnlace: [this.promotion.tEnlace, [Validators.pattern(/\S+/)]],
      lPorFecha: [this.promotion.lPorFecha, [Validators.required]],
      fFechaInicio: [{ value: this.promotion.fFechaInicio, disabled: !this.promotion.lPorFecha }, [Validators.required]],
      fFechaFin: [{ value: this.promotion.fFechaFin, disabled: !this.promotion.lPorFecha }, [Validators.required]],
      lPorHora: [this.promotion.lPorHora, [Validators.required]],
      hHoraInicio: [{ value: this.timeService.convertTo12HourFormat(this.promotion.hHoraInicio), disabled: !this.promotion.lPorHora }, [Validators.required, Validators.pattern(this.timeService.timePattern)]],
      hHoraFin: [{ value: this.timeService.convertTo12HourFormat(this.promotion.hHoraFin), disabled: !this.promotion.lPorHora }, [Validators.required, Validators.pattern(this.timeService.timePattern)]],
      lPorImporte: [this.promotion.lPorImporte, [Validators.required]],
      dImporteMin: [{ value: this.promotion.dImporteMin, disabled: !this.promotion.lPorImporte }, [Validators.required]],
      dImporteMax: [{ value: this.promotion.dImporteMax, disabled: !this.promotion.lPorImporte }, [Validators.required]],
      tTipoAplicacion: [this.promotion.tTipoAplicacion, [Validators.required]],
      tTipoAplicar: [this.promotion.tTipoAplicar, [Validators.required]],
      dValorAplicar: [{ value: this.promotion.dValorAplicar, disabled: !this.promotion.tTipoAplicar || this.promotion.tTipoAplicar === 'delivery gratis' }, [Validators.required]],
      tDescripcion: [this.promotion.tDescripcion, [Validators.pattern(/\S+/)]],
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

    this.tTipoAplicacionSubscription = this.form.get('tTipoAplicacion')?.valueChanges.subscribe(value => {
      this.handleTipoAplicacionChange(value);
    });

    this.tTipoAplicarSubscription = this.form.get('tTipoAplicar')?.valueChanges.subscribe(value => {
      this.handleTipoAplicarChange(value);
    });

    this.searchControl.disable();
    if (this.form.get('tTipoAplicacion')?.value !== 'todo') {
      this.searchControl.enable();
      this.details.set(JSON.parse(this.promotion.jDetalles));
    }

    this.searchControlSubscription = this.searchControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(value => {
      this.searchTerm.set(value || '');
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
    } else if (value === 'descuento porcentaje' || value === 'delivery descuento') {
      this.form.get('dValorAplicar')?.enable();
      this.symbol = '%';
    } else if (value === 'delivery gratis') {
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
    if (!this.validationService.validateForm(this.form)) {
      return;
    }

    if (!this.validationService.hasSelectedRanges(this.form)) {
      this.alertService.showWarning("Debe seleccionar por lo menos uno de los rangos.");
      return;
    }

    if (this.form.get('lPorFecha')?.value && !this.validationService.validateFecha(this.form)) {
      return;
    }

    if (this.form.get('lPorHora')?.value && !this.validationService.validateHora(this.form, this.timeService.convertTo24HourFormat.bind(this.timeService))) {
      return;
    }

    if (this.form.get('lPorImporte')?.value && !this.validationService.validateImporte(this.form)) {
      return;
    }

    if (!this.validationService.validateValorAplicar(this.form)) {
      return;
    }

    if (!this.validationService.validateTipoAplicacion(this.form, this.details().length)) {
      return;
    }

    this.submit();
  }

  submit() {
    const details = this.details().map(item => item.id);
    const imagen = this.selectedFile;
    this.form.patchValue({
      hHoraInicio: this.timeService.convertTo24HourFormat(this.form.get('hHoraInicio')?.value),
      hHoraFin: this.timeService.convertTo24HourFormat(this.form.get('hHoraFin')?.value),
    })
    const result = {
      ...this.form.value,
      details,
      imagen
    }
    console.log(result);
    this.dialogRef.close(result);
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

  removeFromListDetails(index: number) {
    this.details.update(details => details.filter((_, i) => i !== index));
    console.log(this.details());
  }

  addItem() {
    const selectedItem = this.searchControl.value;
    if (!selectedItem) {
      this.alertService.showWarning("Primero debe buscar un producto o categoría.")
      return;
    }

    const isDuplicate = this.details().some(item => item.id === selectedItem.id);

    if (isDuplicate) {
      this.alertService.showWarning("Este item ya se encuentra agregado.")
      return;
    }

    if (!selectedItem.id) {
      this.alertService.showWarning("Este item no existe.")
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
    if (this.searchControlSubscription) {
      this.searchControlSubscription.unsubscribe();
    }
    Object.values(this.subscriptions).forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }
}
