import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../apiUrl';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/Category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  readonly baseUrl = API_URL;
  readonly http = inject(HttpClient);

  constructor() { }

  getCategories() {
    return this.http.get<Category[]>(`${this.baseUrl}/Categoria`);
  }

  addCategory(tNombre: string, imagen: File, lPrincipal: boolean) {
    console.log(tNombre);
    console.log(imagen);
    console.log(lPrincipal);
    const formData = new FormData();
    formData.append('tNombre', tNombre);
    formData.append('imagen', imagen);
    formData.append('lPrincipal', String(lPrincipal));
    return this.http.post<any>(`${this.baseUrl}/Categoria`, formData);
  }

  deleteCategory(iIdCategoria: number) {
    return this.http.delete<any>(`${this.baseUrl}/Categoria/${iIdCategoria}`);
  }
}
