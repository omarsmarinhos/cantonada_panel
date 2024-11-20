import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '../../../shared/services/alert.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { Branch } from '../../../shared/models/Branch.model';

@Component({
  selector: 'app-zone-add-modal',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatGridListModule
  ],
  templateUrl: './zone-add-modal.component.html',
  styleUrl: './zone-add-modal.component.scss'
})
export class ZoneAddModalComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<this>);
  private readonly alertService = inject(AlertService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSubscription: Subscription | undefined;
  private readonly branch = inject<Branch>(MAT_DIALOG_DATA);

  form: FormGroup;
  colspan = 12;

  constructor() {
    this.form = this.fb.group({
      tNombre: ['', [Validators.required, Validators.pattern(/\S+/)]],
      dPrecio: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(9999.99),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      jPoligono: ['', []],
      iIdSucursal: [this.branch.iIdSucursal]
    });
  }

  ngOnInit() {
    this.breakpointSubscription = this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state: BreakpointState) => {
      this.colspan = state.matches ? 6 : 12;
    });
  }

  onSubmit() {
    if (this.form.invalid) {

      if (this.form.get('tNombre')?.hasError('pattern')) {
        this.alertService.showWarning("No debe ingresar solo espacios en blanco.");
        return;
      }

      if (this.form.get('dPrecio')?.hasError('pattern')) {
        this.alertService.showWarning("Formato incorrecto en el precio");
        return;
      }

      if (this.form.get('dPrecio')?.hasError('min') || this.form.get('dPrecio')?.hasError('max')) {
        this.alertService.showWarning("El precio debe ser mayor que 0 y menor que 10000.00");
        return;
      }

      this.form.markAllAsTouched();
      this.alertService.showWarning("Debe llenar todos los campos.");
      return;
    }

    this.submit();
  }

  submit() {
    this.dialogRef.close(this.form.value);
  }

  onCancel() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }
}
