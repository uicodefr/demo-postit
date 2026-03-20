import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { PostitNote } from '../../../model/postit/postit-note';
import { PostitService } from '@app/service/postit/postit.service';
import { SHARED_FORM, SHARED_MATERIAL } from '@app/common-imports';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface EditNoteDialogData {
  editedNote: PostitNote;
}

@Component({
  selector: 'app-edit-note-dialog',
  imports: [SHARED_FORM, SHARED_MATERIAL, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './edit-note-dialog.component.html',
  styleUrls: ['./edit-note-dialog.component.scss'],
})
export class EditNoteDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<EditNoteDialogComponent>);
  private readonly dialogData = inject<EditNoteDialogData>(MAT_DIALOG_DATA);
  private readonly postitService = inject(PostitService);

  public editedNote = this.dialogData.editedNote;

  public saveEdit(): void {
    const saveNote = {} as PostitNote;
    saveNote.id = this.editedNote.id;
    saveNote.name = this.editedNote.name;
    saveNote.text = this.editedNote.text;

    this.postitService.updateNote(saveNote).subscribe((updatedNote) => {
      this.dialogRef.close(updatedNote);
    });
  }
}
