import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AlertService } from '../../../shared/services/alert.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-menu-add-modal',
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
  templateUrl: './menu-add-modal.component.html',
  styleUrl: './menu-add-modal.component.scss'
})
export class MenuAddModalComponent {

  readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<this>);
  readonly alertService = inject(AlertService);
  readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSubscription: Subscription | undefined;
  private lFragmentoRepetidoSubscription: Subscription | undefined;

  form: FormGroup;
  colspan = 12;

  constructor() {
    this.form = this.fb.group({
      tNombre: ['', [Validators.required, Validators.pattern(/\S+/)]],
      tEnlace: ['', []],
      tFragmento: ['', [Validators.pattern(/\S+/)]],
      lFragmentoRepetido: ['', [Validators.required]],
      lVisible: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.lFragmentoRepetidoSubscription = this.form.get('lFragmentoRepetido')?.valueChanges.subscribe((value) => {
      if (value === true) {
        this.form.get('tEnlace')?.disable();
        this.form.get('tEnlace')?.setValue('');
      } else {
        this.form.get('tEnlace')?.enable();
      }
    });

    this.breakpointSubscription = this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state: BreakpointState) => {
      this.colspan = state.matches ? 6 : 12;
    });
  }

  onSubmit() {
    if (this.form.invalid) {

      if (this.form.get('tNombre')?.hasError('pattern') || this.form.get('tFragmento')?.hasError('pattern')) {
        this.alertService.showWarning("No debe ingresar solo espacios en blanco.");
        return;
      }

      this.form.markAllAsTouched();
      this.alertService.showWarning("Debe llenar todos los campos.");
      return;
    }

    if (!this.form.get('lFragmentoRepetido')?.value) {
      const enlace = this.form.get('tEnlace')?.value;
      if (!enlace.startsWith('/')) {
        this.alertService.showWarning("El enlace debe comenzar con '/'.");
        return;
      }
    }
    
    this.dialogRef.close(this.form.value);
  }

  onCancel() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
    if (this.lFragmentoRepetidoSubscription) {
      this.lFragmentoRepetidoSubscription.unsubscribe();
    }
  }
}
