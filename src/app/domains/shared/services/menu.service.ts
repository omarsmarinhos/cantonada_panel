import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Menu } from '../models/Menu.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  readonly baseUrl = environment.apiUrl;
  readonly http = inject(HttpClient);

  constructor() { }

  getMenus() {
    return this.http.get<Menu[]>(`${this.baseUrl}/Menu`);
  }

  addMenu(menu: Menu) {
    return this.http.post<any>(`${this.baseUrl}/Menu`, menu);
  }

  editMenu(menu: Menu) {
    return this.http.put<any>(`${this.baseUrl}/Menu`, menu);
  }

  deleteMenu(iIdMenu: number) {
    return this.http.delete<any>(`${this.baseUrl}/Menu/${iIdMenu}`);
  }

  sortMenu(ordenMenus: { iId: number | undefined; nOrden: number }[]) {
    return this.http.post<any>(`${this.baseUrl}/Menu/Ordenar`, ordenMenus);
  }
}