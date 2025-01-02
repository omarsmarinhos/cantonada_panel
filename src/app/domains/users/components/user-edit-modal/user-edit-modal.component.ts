import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
import { AlertService } from '../../../shared/services/alert.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { UserService } from '../../../shared/services/user.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Branch } from '../../../shared/models/Branch.model';
import { Role } from '../../../shared/models/role.model';
import { Subscription } from 'rxjs';
import { UserResponse } from '../../../shared/models/user-response.model';
import { UserRequest } from '../../../shared/models/user-request.model';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatSelectModule,
    CapitalizePipe,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './user-edit-modal.component.html',
  styleUrl: './user-edit-modal.component.scss'
})
export class UserEditModalComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<this>);
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);
  private readonly userService = inject(UserService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly data = inject<{
    branches: Branch[],
    roles: Role[],
    user: UserResponse
  }>(MAT_DIALOG_DATA);
  private iIdRolSubscription: Subscription | undefined;
  private breakpointSubscription: Subscription | undefined;

  form: FormGroup;
  colspan3: number = 12;
  branches = signal<Branch[]>([]);
  roles = signal<Role[]>([]);

  constructor() {
    this.form = this.fb.group({
      iIdUsuario: this.data.user.iIdUsuario,
      tNombre: [this.data.user.tNombre, [
        Validators.required,
        Validators.pattern(/\S+/)
      ]],
      tUsername: [this.data.user.tUsername, [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ]],
      tPassword: ['', [
        Validators.minLength(3),
        Validators.pattern(/^\S+$/)
      ]],
      iIdRol: [this.data.user.iIdRol, [
        Validators.required
      ]],
      iIdSucursal: [{ value: this.data.user.iIdSucursal, disabled: this.data.user.iIdRol === 1 }, [
        Validators.required
      ]],
    });
  }

  ngOnInit() {
    this.branches.set(this.data.branches);
    this.roles.set(this.data.roles);
    this.breakpointSubscription = this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state: BreakpointState) => {
      this.colspan3 = state.matches ? 4 : 12;
    });
    this.iIdRolSubscription = this.form.get('iIdRol')?.valueChanges.subscribe(value => {
      this.handleRoleChange(value);
    });
  }

  handleRoleChange(value: number) {
    if (value === 1) {
      this.form.get("iIdSucursal")?.setValue("");
      this.form.get("iIdSucursal")?.disable();
    } else {
      this.form.get("iIdSucursal")?.enable();
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      const { tNombre, tUsername, tPassword } = this.form.controls;

      if (tNombre.hasError('pattern')) {
        this.alertService.showWarning("El nombre no debe contener solo espacios en blanco.")
        return;
      }

      if (tUsername.hasError('minlength')) {
        this.alertService.showWarning(`El username debe tener como mínimo ${tUsername.errors?.['minlength'].requiredLength} caracteres.`)
        return;
      }

      if (tPassword.hasError('minlength')) {
        this.alertService.showWarning(`El password debe tener como mínimo ${tPassword.errors?.['minlength'].requiredLength} caracteres.`)
        return;
      }

      if (tUsername.hasError('pattern')) {
        this.alertService.showWarning("El username debe tener solo letras y números, sin espacios.")
        return;
      }

      if (tPassword.hasError('pattern')) {
        this.alertService.showWarning("El password no debe contener espacios en blanco.")
        return;
      }

      this.alertService.showWarning("LLenar o corregir los campos.");
      return;
    }

    this.submit();
  }

  submit() {
    const { tNombre } = this.form.value;
    const user: UserRequest = {
      ...this.form.value,
      tNombre: tNombre.trim(),
    }
    this.userService.editUser(user).subscribe({
      next: (res) => {
        this.alertService.showSuccess(res.mensaje);
        console.log(res)
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.errorService.showError(err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
    if (this.iIdRolSubscription) {
      this.iIdRolSubscription.unsubscribe();
    }
  }
}