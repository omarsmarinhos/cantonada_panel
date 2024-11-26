import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/Category.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  readonly baseUrl = environment.apiUrl;
  readonly http = inject(HttpClient);

  constructor() { }

  getCategories() {
    return this.http.get<Category[]>(`${this.baseUrl}/Categoria`);
  }

  addCategory(tNombre: string, imagen: File, lPrincipal: boolean) {
    const formData = new FormData();
    formData.append('tNombre', tNombre);
    formData.append('imagen', imagen);
    formData.append('lPrincipal', String(lPrincipal));
    return this.http.post<any>(`${this.baseUrl}/Categoria`, formData);
  }

  editCategory(categoryData: any) {
    const formData = new FormData();
    formData.append('iIdCategoria', categoryData.iIdCategoria);
    formData.append('tNombre', categoryData.tNombre);
    formData.append('lPrincipal', String(categoryData.lPrincipal));
    formData.append('imageChanged', String(categoryData.imageChanged));
    if (categoryData.imageChanged && categoryData.imagen) {
      formData.append('imagen', categoryData.imagen);
    }
    return this.http.put<any>(`${this.baseUrl}/Categoria`, formData);
  }

  deleteCategory(iIdCategoria: number) {
    return this.http.delete<any>(`${this.baseUrl}/Categoria/${iIdCategoria}`);
  }

  orderCategories(ordenCategorias: { iId: number; nOrden: number }[]) {
    return this.http.post<any>(`${this.baseUrl}/Categoria/Ordenar`, ordenCategorias);
  }
}
