import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaEspanol',
  standalone: true
})
export class FechaEspanolPipe implements PipeTransform {

  private readonly diasEspanol = {
    'Monday': 'Lunes',
    'Tuesday': 'Martes',
    'Wednesday': 'Miércoles',
    'Thursday': 'Jueves',
    'Friday': 'Viernes',
    'Saturday': 'Sábado',
    'Sunday': 'Domingo'
  };

  private readonly mesesEspanol = {
    'January': 'Enero',
    'February': 'Febrero',
    'March': 'Marzo',
    'April': 'Abril',
    'May': 'Mayo',
    'June': 'Junio',
    'July': 'Julio',
    'August': 'Agosto',
    'September': 'Septiembre',
    'October': 'Octubre',
    'November': 'Noviembre',
    'December': 'Diciembre'
  };

  transform(value: string | null): string {
    if (!value) {
      return '';
    }
    for (const [ingles, espanol] of Object.entries(this.diasEspanol)) {
      value = value.replace(ingles, espanol);
    }

    for (const [ingles, espanol] of Object.entries(this.mesesEspanol)) {
      value = value.replace(ingles, espanol);
    }

    return value;
  }

}
