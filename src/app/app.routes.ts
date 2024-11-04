import { Routes } from '@angular/router';
import LayoutComponent from './domains/shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path:'',
    component: LayoutComponent,
    // loadComponent: () => import('./domains/shared/components/layout/layout.component'),
    children: [
      {
        path: 'categorias',
        loadComponent: ()=> import('./domains/categories/categories/categories.component')
      }
    ]
  }
];
