import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/pages/login/login').then(m => m.LoginPage),
  },
  {
    path: '',
    loadComponent: () =>
      import('./modules/layout/layout').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./modules/dashboard/pages/dashboard/dashboard').then(m => m.DashboardPage),
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./modules/clientes/pages/clientes-list/clientes-list').then(m => m.ClientesListPage),
      },
      {
        path: 'clientes/nuevo',
        loadComponent: () =>
          import('./modules/clientes/pages/cliente-form/cliente-form').then(m => m.ClienteFormPage),
      },
      {
        path: 'clientes/:id',
        loadComponent: () =>
          import('./modules/clientes/pages/cliente-form/cliente-form').then(m => m.ClienteFormPage),
      },
      {
        path: 'conceptos',
        loadComponent: () =>
          import('./modules/conceptos/pages/conceptos-list/conceptos-list').then(m => m.ConceptosListPage),
      },
      {
        path: 'cuentas',
        loadComponent: () =>
          import('./modules/cuentas/pages/cuentas-list/cuentas-list').then(m => m.CuentasListPage),
      },
      {
        path: 'cuentas/nueva',
        loadComponent: () =>
          import('./modules/cuentas/pages/cuenta-form/cuenta-form').then(m => m.CuentaFormPage),
      },
      {
        path: 'cuentas/:id',
        loadComponent: () =>
          import('./modules/cuentas/pages/cuenta-detalle/cuenta-detalle').then(m => m.CuentaDetallePage),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
