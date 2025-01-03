import { Routes } from '@angular/router';
import LayoutComponent from './domains/shared/components/layout/layout.component';
import { adminGuard, isAuthorizedForBranch, privateGuard, publicGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [publicGuard()],
    loadComponent: () => import('./domains/auth/auth.component')
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [privateGuard()],
    children: [
      {
        path: 'sucursales',
        loadComponent: () => import('./domains/branches/branches.component'),
        canMatch: [adminGuard(["Admin", "User"])]
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./domains/orders/orders-branches/orders-branches.component'),
        canMatch: [adminGuard(["Admin", "User"])]
      },
      {
        path: 'pedidos/:id',
        loadComponent: () => import('./domains/orders/orders/orders.component'),
        canMatch: [adminGuard(["Admin", "User"]), isAuthorizedForBranch()]
      },
      {
        path: 'promociones',
        loadComponent: () => import('./domains/promotions/promotions.component'),
        canMatch: [adminGuard(["Admin"])]
      },
      {
        path: 'zonas/:id',
        loadComponent: () => import('./domains/zones/zones.component'),
        canMatch: [adminGuard(["Admin", "User"]), isAuthorizedForBranch()]
      },
      {
        path: 'categorias',
        loadComponent: () => import('./domains/categories/categories.component'),
        canMatch: [adminGuard(["Admin"])]
      },
      {
        path: 'orden-categorias',
        loadComponent: () => import('./domains/order-categories/order-categories.component'),
        canMatch: [adminGuard(["Admin"])]
      },
      {
        path: 'productos',
        loadComponent: () => import('./domains/products/products.component'),
        canMatch: [adminGuard(["Admin"])]
      },
      {
        path: 'orden-productos',
        loadComponent: () => import('./domains/order-productos/order-productos.component'),
        canMatch: [adminGuard(["Admin"])]
      },
      {
        path: 'clientes',
        loadComponent: () => import('./domains/customers/customers.component'),
        canMatch: [adminGuard(["Admin"])]
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./domains/users/users.component'),
        canMatch: [adminGuard(["Admin"])]
      },
      {
        path: 'reservas',
        loadComponent: () => import('./domains/reservations/reservations-branches/reservations-branches.component'),
        canMatch: [adminGuard(["Admin", "User"])]
      },
      {
        path: 'reservas/:id',
        loadComponent: () => import('./domains/reservations/reservations/reservations.component'),
        canMatch: [adminGuard(["Admin", "User"]), isAuthorizedForBranch()]
      },
      {
        path: 'reclamaciones',
        loadComponent: () => import('./domains/complaints/complaints.component'),
        canMatch: [adminGuard(["Admin", "User"])]
      },
      {
        path: 'reclamaciones/:id',
        loadComponent: () => import('./domains/complaints-detail/complaints-detail.component'),
        canMatch: [adminGuard(["Admin", "User"]), isAuthorizedForBranch()]
      },
      {
        path: 'menu',
        loadComponent: () => import('./domains/menus/menus.component'),
        canMatch: [adminGuard(["Admin"])]
      },
      {
        path: 'configuracion',
        loadComponent: () => import('./domains/configurations/configurations.component'),
        canMatch: [adminGuard(["Admin"])]
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];
