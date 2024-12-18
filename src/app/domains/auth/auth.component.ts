import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AlertService } from '../shared/services/alert.service';
import { AuthService } from '../shared/services/auth.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export default class AuthComponent {
  hide = true;
  loginForm: FormGroup;
  isLoading = false;

  @ViewChild('usuarioInput') usuarioInput!: ElementRef;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly alertService = inject(AlertService);
  private readonly errorService = inject(ErrorHandlerService);

  constructor() {
    this.loginForm = this.formBuilder.group({
      usuario: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^\S*$/),
        ],
      ],
      clave: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.usuarioInput.nativeElement.focus();
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      if (
        this.loginForm.get('usuario')?.hasError('required') ||
        this.loginForm.get('clave')?.hasError('required')
      ) {
        this.alertService.showWarning('Por favor, completa todos los campos.');
      } else {
        this.alertService.showWarning('Por favor, corrige los errores en el formulario.');
      }
      return;
    }
    this.isLoading = true;
    const { usuario, clave } = this.loginForm.value;
    this.authService.login(usuario, clave).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.alertService.showSuccess('Login exitoso.');
        this.authService.setUser(response);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorService.showError(err);
      },
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('pattern') && controlName === 'usuario') {
      return 'No se permiten espacios en blanco';
    }
    return '';
  }
}
