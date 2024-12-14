import { Routes } from '@angular/router';
import LayoutComponent from './domains/shared/components/layout/layout.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./domains/auth/auth.component')
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'sucursales',
        loadComponent: () => import('./domains/branches/branches.component')
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./domains/orders/orders.component')
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
        path: 'clientes',
        loadComponent: () => import('./domains/customers/customers.component')
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
