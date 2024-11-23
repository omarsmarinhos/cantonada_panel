import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AlertService } from '../alert.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  private readonly alertService = inject(AlertService);

  constructor() {}

  validateForm(form: FormGroup): boolean {
    if (form.invalid) {
      this.handleFormErrors(form);
      return false;
    }
    return true;
  }

  private handleFormErrors(form: FormGroup): void {
    const tNombreError = form.get('tNombre')?.hasError('pattern');
    const tEnlaceError = form.get('tEnlace')?.hasError('pattern');
    const tDescripcionError = form.get('tDescripcion')?.hasError('pattern');

    if (tNombreError || tEnlaceError || tDescripcionError) {
      this.alertService.showWarning("No debe ingresar solo espacios en blanco.");
      return;
    }

    const hHoraInicioError = form.get('hHoraInicio')?.hasError('pattern');
    const hHoraFinError = form.get('hHoraFin')?.hasError('pattern');
    if (hHoraInicioError || hHoraFinError) {
      this.alertService.showWarning("Las horas deben tener el formato válido (hh:mm AM/PM).");
      return;
    }

    form.markAllAsTouched();
    this.alertService.showWarning("Debe llenar todos los campos");
  }

  validateFecha(form: FormGroup): boolean {
    const dateInicio = new Date(form.get('fFechaInicio')?.value);
    const dateFin = new Date(form.get('fFechaFin')?.value);

    if (dateFin.getTime() <= dateInicio.getTime()) {
      this.alertService.showWarning("La fecha de fin no puede ser igual o menor a la fecha de inicio.");
      return false;
    }
    return true;
  }

  validateHora(form: FormGroup, convertTo24HourFormat: (time: string) => string): boolean {
    const horaInicio = form.get('hHoraInicio')?.value;
    const horaFin = form.get('hHoraFin')?.value;

    const horaInicio24 = convertTo24HourFormat(horaInicio);
    const horaFin24 = convertTo24HourFormat(horaFin);

    if (horaFin24 <= horaInicio24) {
      this.alertService.showWarning("La hora de fin no puede ser igual o menor a la hora de inicio.");
      return false;
    }
    return true;
  }

  validateImporte(form: FormGroup): boolean {
    const dImporteMin = form.get('dImporteMin')?.value;
    const dImporteMax = form.get('dImporteMax')?.value;

    if (dImporteMin < 0 || dImporteMax < 0) {
      this.alertService.showWarning("El importe no puede ser negativo.");
      return false;
    }

    if (dImporteMax < dImporteMin) {
      this.alertService.showWarning("El importe máximo no puede ser menor al importe mínimo.");
      return false;
    }

    return true;
  }

  validateValorAplicar(form: FormGroup): boolean {
    const dValorAplicar = form.get('dValorAplicar')?.value;
    if (dValorAplicar < 0) {
      this.alertService.showWarning("El importe no puede ser negativo.");
      return false;
    }
    return true;
  }

  validateTipoAplicacion(form: FormGroup, detailsLength: number): boolean {
    const tTipoAplicacion = form.get('tTipoAplicacion')?.value;
    if (tTipoAplicacion !== 'todo' && detailsLength === 0) {
      this.alertService.showWarning("Debe agregar por lo menos un producto o categoría.");
      return false;
    }
    return true;
  }

  hasSelectedRanges(form: FormGroup): boolean {
    const lPorFecha = form.get('lPorFecha')?.value;
    const lPorHora = form.get('lPorHora')?.value;
    const lPorImporte = form.get('lPorImporte')?.value;
    return lPorFecha || lPorHora || lPorImporte;
  }
}
