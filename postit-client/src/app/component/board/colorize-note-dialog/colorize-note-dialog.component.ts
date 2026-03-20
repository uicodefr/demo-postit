import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { PostitService } from '@app/service/postit/postit.service';
import { PostitNote } from '@app/model/postit/postit-note';
import { SHARED_MATERIAL } from '@app/common-imports';

export interface ColorizeNoteDialogData {
  noteId: number;
}

@Component({
  selector: 'app-colorize-note-dialog',
  imports: [SHARED_MATERIAL, MatDialogModule],
  templateUrl: './colorize-note-dialog.component.html',
  styleUrls: ['./colorize-note-dialog.component.scss'],
})
export class ColorizeNoteDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ColorizeNoteDialogComponent>);
  private readonly dialogData = inject<ColorizeNoteDialogData>(MAT_DIALOG_DATA);
  private readonly postitService = inject(PostitService);

  public chooseColor(color: string): void {
    const saveNote = {} as PostitNote;
    saveNote.id = this.dialogData.noteId;
    saveNote.color = color;

    this.postitService.updateNote(saveNote).subscribe((updatedNote) => {
      this.dialogRef.close(updatedNote);
    });
  }
}
