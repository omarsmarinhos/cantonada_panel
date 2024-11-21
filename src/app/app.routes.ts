import { Routes } from '@angular/router';
import LayoutComponent from './domains/shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    // loadComponent: () => import('./domains/shared/components/layout/layout.component'),
    children: [
      {
        path: 'sucursales',
        loadComponent: () => import('./domains/branches/branches.component')
      },
      {
        path: 'promociones',
        loadComponent: () => import('./domains/promotions/promotions.component')
      },
      {
        path: 'zonas/:id',
        loadComponent: () => import('./domains/zones/zones.component')
      },
      {
        path: 'categorias',
        loadComponent: () => import('./domains/categories/categories.component')
      },
      {
        path: 'orden-categorias',
        loadComponent: () => import('./domains/order-categories/order-categories.component')
      },
      {
        path: 'productos',
        loadComponent: () => import('./domains/products/products.component')
      },
      {
        path: 'orden-productos',
        loadComponent: () => import('./domains/order-productos/order-productos.component')
      },
      {
        path: 'menu',
        loadComponent: () => import('./domains/menus/menus.component')
      },
      {
        path: 'configuracion',
        loadComponent: () => import('./domains/configurations/configurations.component')
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];
