import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardComponent } from './component/board/board.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { SettingsComponent } from './component/settings/settings.component';
import { LoginComponent } from './component/login/login.component';
import { AuthGuard } from './service/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: BoardComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'board/:id',
    component: BoardComponent
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
