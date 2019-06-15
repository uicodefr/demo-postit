import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { BoardNoteComponent } from './board/board-note/board-note.component';
import { ConfirmDialogComponent } from './shared/component/dialog/confirm-dialog/confirm-dialog.component';
import { ColorizeNoteDialogComponent } from './board/colorize-note-dialog/colorize-note-dialog.component';
import { EditNoteDialogComponent } from './board/edit-note-dialog/edit-note-dialog.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SettingsComponent } from './settings/settings.component';
import { HighlightDirective } from './shared/directive/highlight.directive';
import { BoardSettingsComponent } from './settings/board-settings/board-settings.component';
import { UserSettingsComponent } from './settings/user-settings/user-settings.component';
import { LoginComponent } from './login/login.component';
import { AppMaterialModule } from './app-material.module';
import { InitService } from './shared/auth/init.service';
import { HasRoleDirective } from './shared/directive/has-role.directive';
import { AuthInterceptor } from './shared/auth/auth.interceptor';

export function startupServiceFactory(initService: InitService): Function {
  return () => initService.startupInit();
}

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    BoardNoteComponent,
    ConfirmDialogComponent,
    ColorizeNoteDialogComponent,
    EditNoteDialogComponent,
    PageNotFoundComponent,
    SettingsComponent,
    HighlightDirective,
    BoardSettingsComponent,
    UserSettingsComponent,
    LoginComponent,
    HasRoleDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AppMaterialModule
  ],
  entryComponents: [
    ConfirmDialogComponent,
    ColorizeNoteDialogComponent,
    EditNoteDialogComponent
  ],
  providers: [
    InitService,
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [InitService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
