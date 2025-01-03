import { Component, inject, signal } from '@angular/core';
import { ConfigurationService } from '../shared/services/configuration.service';
import { ConfigurationResponse } from '../shared/models/ConfigurationResponse.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { Subscription } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AlertService } from '../shared/services/alert.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { AuthService } from '../shared/services/auth.service';
import { UnitMeasure } from '../shared/models/unit-measure.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.scss'
})
export default class ConfigurationsComponent {

  private readonly configurationService = inject(ConfigurationService);
  private readonly fb = inject(FormBuilder);
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly productService = inject(ProductService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly authService = inject(AuthService);
  private breakpointSubscription: Subscription | undefined;

  isSynchronizedWithFast = this.authService.isSynchronizedWithFast();

  configuration: ConfigurationResponse = {
    configuracion: {
      igv: 0,
      recargoConsumo: 0,
      iIdUsuarioFast: 0,
      iIdPrecioAplicar: 0,
      iIdTerminal: 0,
      iIdDeliveryFast: 0,
      tNombreDelivery: '',
      tUnidadMedidaDelivery: ''
    },
    configImagenes: []
  };

  formGeneral: FormGroup;
  formCategoria: FormGroup;
  formProducto: FormGroup;
  formSucursal: FormGroup;
  colspan: number = 12;
  colspan4: number = 12;
  isDisabledGeneral: boolean = true;
  isDisabledCategoria: boolean = true;
  isDisabledProducto: boolean = true;
  isDisabledSucursal: boolean = true;

  aspectRatios: string[] = ['1:1', '4:3', '3:2', '16:9']
  fieldsGeneral: string[] = ['igv', 'recargoConsumo'];
  fieldsFast: string[] = ['iIdUsuarioFast', 'iIdPrecioAplicar', 'iIdTerminal', 'iIdDeliveryFast', 'tNombreDelivery', 'tUnidadMedidaDelivery']
  fieldsImg: string[] = ['maxWidth', 'maxHeight', 'aspectRatio']

  units = signal<UnitMeasure[]>([]);
  filteredUnits = signal<UnitMeasure[]>([]);

  constructor() {
    console.log(this.isSynchronizedWithFast);
    this.formGeneral = this.fb.group({
      igv: [{ value: '', disabled: this.isDisabledGeneral }, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        this.numericValidator]
      ],
      recargoConsumo: [{ value: '', disabled: this.isDisabledGeneral }, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        this.numericValidator]
      ],
      iIdUsuarioFast: [{ value: '', disabled: this.isDisabledGeneral }, [
        Validators.required,
        this.integerValidator]
      ],
      iIdPrecioAplicar: [{ value: '', disabled: this.isDisabledGeneral }, [
        Validators.required,
        this.integerValidator]
      ],
      iIdTerminal: [{ value: '', disabled: this.isDisabledGeneral }, [
        Validators.required,
        this.integerValidator]
      ],
      iIdDeliveryFast: [{ value: '', disabled: this.isDisabledGeneral }, [
        Validators.required,
        this.integerValidator
      ]],
      tNombreDelivery: [{ value: '', disabled: this.isDisabledGeneral }, [
        Validators.required
      ]],
      tUnidadMedidaDelivery: [{ value: '', disabled: this.isDisabledGeneral }, [
        Validators.required
      ]],
    });
    this.formCategoria = this.fb.group({
      iIdConfigImagen: [''],
      maxWidth: [{ value: '', disabled: this.isDisabledCategoria }, [Validators.required, Validators.min(1), this.integerValidator]],
      maxHeight: [{ value: '', disabled: this.isDisabledCategoria }, [Validators.required, Validators.min(1), this.integerValidator]],
      aspectRatio: [{ value: '', disabled: this.isDisabledProducto }, [Validators.required]]
    });
    this.formProducto = this.fb.group({
      iIdConfigImagen: [''],
      maxWidth: [{ value: '', disabled: this.isDisabledProducto }, [Validators.required, Validators.min(1), this.integerValidator]],
      maxHeight: [{ value: '', disabled: this.isDisabledProducto }, [Validators.required, Validators.min(1), this.integerValidator]],
      aspectRatio: [{ value: '', disabled: this.isDisabledProducto }, [Validators.required]]
    });
    this.formSucursal = this.fb.group({
      iIdConfigImagen: [''],
      maxWidth: [{ value: '', disabled: this.isDisabledSucursal }, [Validators.required, Validators.min(1), this.integerValidator]],
      maxHeight: [{ value: '', disabled: this.isDisabledSucursal }, [Validators.required, Validators.min(1), this.integerValidator]],
      aspectRatio: [{ value: '', disabled: this.isDisabledProducto }, [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadUnits();
    this.loadConfiguration();
    this.breakpointSubscription = this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.colspan = 6;
        this.colspan4 = 4;
      } else {
        this.colspan = 12;
        this.colspan4 = 12;
      }
    });
  }

  loadConfiguration() {
    this.configurationService.getConfiguration().subscribe({
      next: (res) => {
        this.configuration = res;
        this.loadConfigurationGeneral();
        this.loadConfigurationCategoria();
        this.loadConfigurationProducto();
        this.loadConfigurationSucursal();
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }

  loadConfigurationGeneral() {
    this.formGeneral.patchValue({
      igv: this.configuration.configuracion.igv,
      recargoConsumo: this.configuration.configuracion.recargoConsumo,
      iIdUsuarioFast: this.configuration.configuracion.iIdUsuarioFast,
      iIdPrecioAplicar: this.configuration.configuracion.iIdPrecioAplicar,
      iIdTerminal: this.configuration.configuracion.iIdTerminal,
      iIdDeliveryFast: this.configuration.configuracion.iIdDeliveryFast,
      tNombreDelivery: this.configuration.configuracion.tNombreDelivery,
      tUnidadMedidaDelivery: this.configuration.configuracion.tUnidadMedidaDelivery
    });
  }
  loadConfigurationCategoria() {
    this.formCategoria.patchValue({
      iIdConfigImagen: this.configuration.configImagenes[0].iIdConfigImagen,
      maxWidth: this.configuration.configImagenes[0].maxWidth,
      maxHeight: this.configuration.configImagenes[0].maxHeight,
      aspectRatio: this.configuration.configImagenes[0].aspectRatio
    });
  }
  loadConfigurationProducto() {
    this.formProducto.patchValue({
      iIdConfigImagen: this.configuration.configImagenes[1].iIdConfigImagen,
      maxWidth: this.configuration.configImagenes[1].maxWidth,
      maxHeight: this.configuration.configImagenes[1].maxHeight,
      aspectRatio: this.configuration.configImagenes[1].aspectRatio
    });
  }
  loadConfigurationSucursal() {
    this.formSucursal.patchValue({
      iIdConfigImagen: this.configuration.configImagenes[2].iIdConfigImagen,
      maxWidth: this.configuration.configImagenes[2].maxWidth,
      maxHeight: this.configuration.configImagenes[2].maxHeight,
      aspectRatio: this.configuration.configImagenes[2].aspectRatio
    });
  }

  onSaveGeneralSettings(): boolean {
    if (this.formGeneral.invalid) {
      this.formGeneral.markAllAsTouched();
      this.alertService.showWarning("Campos incorrectos");
      return false;
    }

    this.configurationService.editConfigGeneral(this.formGeneral.value).subscribe({
      next: (res) => {
        this.alertService.showSuccess(res.mensaje);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
    return true;
  }

  toggleBtnGeneral() {
    if (!this.isDisabledGeneral) {
      if (!this.onSaveGeneralSettings()) return
    }
    this.isDisabledGeneral = !this.isDisabledGeneral;
    this.setFieldsDisabled(this.isDisabledGeneral, this.formGeneral, this.fieldsGeneral);
    if (this.isSynchronizedWithFast) {
      this.setFieldsDisabled(this.isDisabledGeneral, this.formGeneral, this.fieldsFast);
    }
  }

  cancelGeneral() {
    this.isDisabledGeneral = true;
    this.setFieldsDisabled(this.isDisabledGeneral, this.formGeneral, this.fieldsGeneral);
    if (this.isSynchronizedWithFast) {
      this.setFieldsDisabled(this.isDisabledGeneral, this.formGeneral, this.fieldsFast);
    }
    this.loadConfigurationGeneral();
  }

  validWidthAndHeightWithAspectRatio(form: FormGroup): boolean {
    const maxWidth = form.get('maxWidth')?.value;
    const maxHeight = form.get('maxHeight')?.value;
    const aspectRatio = form.get('aspectRatio')?.value;

    const [aspectWidth, aspectHeight] = aspectRatio.split(':').map(Number);

    if (Math.abs(maxWidth / maxHeight - aspectWidth / aspectHeight) > 0.01) {
      const suggestedHeight = Math.round(maxWidth * (aspectHeight / aspectWidth));
      const suggestedWidth = Math.round(maxHeight * (aspectWidth / aspectHeight));
      this.alertService.showWarning(
        `Los valores del ancho y alto no corresponden a la relación de aspecto seleccionado (${aspectWidth}:${aspectHeight}). ` +
        `Puedes usar un ancho de ${maxWidth}px con un alto de ${suggestedHeight}px, ` +
        `o un alto de ${maxHeight}px con un ancho de ${suggestedWidth}px.`, 5000
      );
      return false;
    }
    return true;
  }

  onSaveCategoriaSettings(): boolean {
    if (this.formCategoria.invalid) {
      this.alertService.showWarning("Campos incorrectos");
      return false;
    }

    if (!this.validWidthAndHeightWithAspectRatio(this.formCategoria)) return false;

    this.configurationService.editConfigImagen(this.formCategoria.value).subscribe({
      next: (res) => {
        this.alertService.showSuccess(res.mensaje);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
    return true;
  }

  toggleBtnCategoria() {
    if (!this.isDisabledCategoria) {
      if (!this.onSaveCategoriaSettings()) return
    }
    this.isDisabledCategoria = !this.isDisabledCategoria;
    this.setFieldsDisabled(this.isDisabledCategoria, this.formCategoria, this.fieldsImg);

  }

  cancelCategoria() {
    this.isDisabledCategoria = true;
    this.setFieldsDisabled(this.isDisabledCategoria, this.formCategoria, this.fieldsImg);
  }

  onSaveProductoSettings(): boolean {
    if (this.formProducto.invalid) {
      this.alertService.showWarning("Campos incorrectos");
      return false;
    }

    if (!this.validWidthAndHeightWithAspectRatio(this.formProducto)) return false;

    this.configurationService.editConfigImagen(this.formProducto.value).subscribe({
      next: (res) => {
        this.alertService.showSuccess(res.mensaje);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
    return true;
  }

  toggleBtnProducto() {
    if (!this.isDisabledProducto) {
      if (!this.onSaveProductoSettings()) return;
    }
    this.isDisabledProducto = !this.isDisabledProducto;
    this.setFieldsDisabled(this.isDisabledProducto, this.formProducto, this.fieldsImg);
  }

  cancelProducto() {
    this.isDisabledProducto = true;
    this.setFieldsDisabled(this.isDisabledProducto, this.formProducto, this.fieldsImg);
  }

  onSaveSucursalSettings(): boolean {
    if (this.formSucursal.invalid) {
      this.alertService.showWarning("Campos incorrectos");
      return false;
    }

    if (!this.validWidthAndHeightWithAspectRatio(this.formSucursal)) return false;

    this.configurationService.editConfigImagen(this.formSucursal.value).subscribe({
      next: (res) => {
        this.alertService.showSuccess(res.mensaje);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
    return true;
  }

  toggleBtnSucursal() {
    if (!this.isDisabledSucursal) {
      if (!this.onSaveSucursalSettings()) return
    }
    this.isDisabledSucursal = !this.isDisabledSucursal;
    this.setFieldsDisabled(this.isDisabledSucursal, this.formSucursal, this.fieldsImg);
  }

  cancelSucursal() {
    this.isDisabledSucursal = true;
    this.setFieldsDisabled(this.isDisabledSucursal, this.formSucursal, this.fieldsImg);
  }

  setFieldsDisabled(disabled: boolean, form: FormGroup, fields: string[]) {
    fields.forEach(field => {
      const control = form.get(field);
      if (control) {
        disabled ? control.disable() : control.enable();
      }
    });
  }

  numericValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === '' || isNaN(value) || value < 0 || value > 100) {
      return { numericError: 'El valor debe ser un número entre 0 y 100.' };
    }
    return null;
  }

  integerValidator(control: AbstractControl): ValidationErrors | null {
    const value = Number(control.value);
    if (!Number.isInteger(value) || value <= 0 || isNaN(value)) {
      return { integerError: 'El valor debe ser un número entero positivo.' };
    }
    return null;
  }

  loadUnits() {
    this.productService.getUnits().subscribe({
      next: (res) => {
        this.units.set(res);
        this.filteredUnits.set(res);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }

  filterUnits(controlName: string): void {
    const inputValue = this.formGeneral.get(controlName)?.value?.toLowerCase() || '';
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
