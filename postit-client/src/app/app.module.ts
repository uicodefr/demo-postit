import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BoardComponent } from './component/board/board.component';
import { BoardNoteComponent } from './component/board/board-note/board-note.component';
import { ConfirmDialogComponent } from './component/shared/dialog/confirm-dialog/confirm-dialog.component';
import { ColorizeNoteDialogComponent } from './component/board/colorize-note-dialog/colorize-note-dialog.component';
import { EditNoteDialogComponent } from './component/board/edit-note-dialog/edit-note-dialog.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { SettingsComponent } from './component/settings/settings.component';
import { HighlightDirective } from './directive/highlight.directive';
import { BoardSettingsComponent } from './component/settings/board-settings/board-settings.component';
import { UserSettingsComponent } from './component/settings/user-settings/user-settings.component';
import { LoginComponent } from './component/login/login.component';
import { AppMaterialModule } from './app-material.module';
import { HasRoleDirective } from './directive/has-role.directive';
import { AuthInterceptor } from './service/auth/auth.interceptor';

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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
