import { Component, inject } from '@angular/core';
import { ConfigurationService } from '../shared/services/configuration.service';
import { ConfigurationResponse } from '../shared/models/ConfigurationResponse.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { Subscription } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

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
    ReactiveFormsModule
  ],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.scss'
})
export default class ConfigurationsComponent {

  readonly configurationService = inject(ConfigurationService);
  readonly fb = inject(FormBuilder);
  readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSubscription: Subscription | undefined;

  configuration: ConfigurationResponse = {
    configuracion: {
      igv: 0,
      recargoConsumo: 0,
      // lFast: false
    },
    configImagenes: []
  };

  formGeneral: FormGroup;
  formCategoria: FormGroup;
  formProducto: FormGroup;
  formSucursal: FormGroup;
  colspan: number = 10;
  colspanImg: number = 12;
  isDisabledGeneral: boolean = true;
  isDisabledCategoria: boolean = true;
  isDisabledProducto: boolean = true;
  isDisabledSucursal: boolean = true;

  aspectRatios: string[] = ['1:1', '4:3', '3:2', '16:9']

  constructor() {
    this.formGeneral = this.fb.group({
      igv: [{ value: '', disabled: this.isDisabledGeneral }, [Validators.required]],
      recargoConsumo: [{ value: '', disabled: this.isDisabledGeneral }, [Validators.required]],
      // lFast: [{ value: '', disabled: this.isDisabled }, [Validators.required]],
    });
    this.formCategoria = this.fb.group({
      maxWidth: [{ value: '', disabled: this.isDisabledCategoria }, [Validators.required]],
      maxHeight: [{ value: '', disabled: this.isDisabledCategoria }, [Validators.required]],
      aspectRatio: [{ value: '', disabled: this.isDisabledProducto }, [Validators.required]]
    });
    this.formProducto = this.fb.group({
      maxWidth: [{ value: '', disabled: this.isDisabledProducto }, [Validators.required]],
      maxHeight: [{ value: '', disabled: this.isDisabledProducto }, [Validators.required]],
      aspectRatio: [{ value: '', disabled: this.isDisabledProducto }, [Validators.required]]
    });
    this.formSucursal = this.fb.group({
      maxWidth: [{ value: '', disabled: this.isDisabledSucursal }, [Validators.required]],
      maxHeight: [{ value: '', disabled: this.isDisabledSucursal }, [Validators.required]],
      aspectRatio: [{ value: '', disabled: this.isDisabledProducto }, [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadConfiguration();
    this.breakpointSubscription = this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.colspan = 5;
        this.colspanImg = 4;
      } else {
        this.colspan = 10;
        this.colspanImg = 12;
      }
    });
  }

  loadConfiguration() {
    this.configurationService.getConfiguration().subscribe({
      next: (res) => {
        this.configuration = res;
        this.formGeneral.patchValue({
          igv: res.configuracion.igv,
          recargoConsumo: res.configuracion.recargoConsumo,
          // lFast: res.configuracion.lFast
        });
        this.formCategoria.patchValue({
          maxWidth: res.configImagenes[0].maxWidth,
          maxHeight: res.configImagenes[0].maxHeight,
          aspectRatio: res.configImagenes[0].aspectRatio
        });
        this.formProducto.patchValue({
          maxWidth: res.configImagenes[1].maxWidth,
          maxHeight: res.configImagenes[1].maxHeight,
          aspectRatio: res.configImagenes[1].aspectRatio
        });
        this.formSucursal.patchValue({
          maxWidth: res.configImagenes[2].maxWidth,
          maxHeight: res.configImagenes[2].maxHeight,
          aspectRatio: res.configImagenes[2].aspectRatio
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onEditGeneralSettings() {

  }

  toggleBtnGeneral() {
    this.isDisabledGeneral = !this.isDisabledGeneral;
    this.setFieldsDisabledGeneral(this.isDisabledGeneral);
    if (!this.isDisabledGeneral) {
      this.onEditGeneralSettings();
    }
  }

  cancelGeneral() {
    this.isDisabledGeneral = true;
    this.setFieldsDisabledGeneral(this.isDisabledGeneral);
  }

  toggleBtnCategoria() {
    this.isDisabledCategoria = !this.isDisabledCategoria;
    this.setFieldsDisabledCategoria(this.isDisabledCategoria);
    if (!this.isDisabledCategoria) {
      this.onEditGeneralSettings();
    }
  }

  cancelCategoria() {
    this.isDisabledCategoria = true;
    this.setFieldsDisabledCategoria(this.isDisabledCategoria);
  }

  toggleBtnProducto() {
    this.isDisabledProducto = !this.isDisabledProducto;
    this.setFieldsDisabledProducto(this.isDisabledProducto);
    if (!this.isDisabledProducto) {
      this.onEditGeneralSettings();
    }
  }

  cancelProducto() {
    this.isDisabledProducto = true;
    this.setFieldsDisabledProducto(this.isDisabledProducto);
  }

  toggleBtnSucursal() {
    this.isDisabledSucursal = !this.isDisabledSucursal;
    this.setFieldsDisabledSucursal(this.isDisabledSucursal);
    if (!this.isDisabledSucursal) {
      this.onEditGeneralSettings();
    }
  }

  cancelSucursal() {
    this.isDisabledSucursal = true;
    this.setFieldsDisabledSucursal(this.isDisabledSucursal);
  }

  setFieldsDisabledGeneral(disabled: boolean) {
    const fields = ['igv', 'recargoConsumo'];
    fields.forEach(field => {
      const control = this.formGeneral.get(field);
      if (control) {
        disabled ? control.disable() : control.enable();
      }
    });
  }

  setFieldsDisabledCategoria(disabled: boolean) {
    const fields = ['maxWidth', 'maxHeight', 'aspectRatio'];
    fields.forEach(field => {
      const control = this.formCategoria.get(field);
      if (control) {
        disabled ? control.disable() : control.enable();
      }
    });
  }

  setFieldsDisabledProducto(disabled: boolean) {
    const fields = ['maxWidth', 'maxHeight', 'aspectRatio'];
    fields.forEach(field => {
      const control = this.formProducto.get(field);
      if (control) {
        disabled ? control.disable() : control.enable();
      }
    });
  }

  setFieldsDisabledSucursal(disabled: boolean) {
    const fields = ['maxWidth', 'maxHeight', 'aspectRatio'];
    fields.forEach(field => {
      const control = this.formSucursal.get(field);
      if (control) {
        disabled ? control.disable() : control.enable();
      }
    });
  }

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }
}
