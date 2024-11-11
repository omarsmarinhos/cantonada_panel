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

  form: FormGroup;
  colspan: number = 5;
  isDisabled: boolean = true;

  constructor() {
    this.form = this.fb.group({
      igv: [{ value: '', disabled: this.isDisabled }, [Validators.required]],
      recargoConsumo: [{ value: '', disabled: this.isDisabled }, [Validators.required]],
      // lFast: [{ value: '', disabled: this.isDisabled }, [Validators.required]],
    });
  }

  ngOnInit() {
    this.configurationService.getConfiguration().subscribe({
      next: (res) => {
        this.configuration = res;
        this.form.patchValue({
          igv: res.configuracion.igv,
          recargoConsumo: res.configuracion.recargoConsumo,
          // lFast: res.configuracion.lFast
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.breakpointSubscription = this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.colspan = 5;
      } else {
        this.colspan = 10;
      }
    });
  }

  toggleBtn() {
    this.isDisabled = !this.isDisabled;
    this.setFieldsDisabled(this.isDisabled);
    if (!this.isDisabled) {
      this.onEditGeneralSettings();
    }
  }

  onEditGeneralSettings() {

  }

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  setFieldsDisabled(disabled: boolean) {
    const fields = ['igv', 'recargoConsumo', 'lFast'];
    fields.forEach(field => {
      const control = this.form.get(field);
      if (control) {
        disabled ? control.disable() : control.enable();
      }
    });
  }
}
