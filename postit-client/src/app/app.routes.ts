import { Routes } from '@angular/router';
import { PageNotFoundComponent } from '@app/component/page-not-found/page-not-found.component';
import { AuthGuard } from '@app/service/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/board',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('@app/component/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'board',
    loadComponent: () => import('@app/component/board/board.component').then((m) => m.BoardComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('@app/component/settings/settings.component').then((m) => m.SettingsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'info',
    loadComponent: () => import('@app/component/info/info.component').then((m) => m.InfoComponent),
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
