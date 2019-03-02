import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';

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
    HighlightDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatExpansionModule
  ],
  entryComponents: [
    ConfirmDialogComponent,
    ColorizeNoteDialogComponent,
    EditNoteDialogComponent
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
