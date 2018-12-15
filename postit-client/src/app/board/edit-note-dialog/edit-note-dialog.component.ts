import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { PostitNote } from '../../shared/model/postit/postit-note';
import { PostitService } from 'src/app/shared/service/postit/postit.service';

export interface EditNoteDialogData {
  editedNote: PostitNote;
}

@Component({
  selector: 'app-edit-note-dialog',
  templateUrl: './edit-note-dialog.component.html',
  styleUrls: ['./edit-note-dialog.component.scss']
})
export class EditNoteDialogComponent implements OnInit {

  public editedNote: PostitNote;

  public constructor(
    private dialogRef: MatDialogRef<EditNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditNoteDialogData,
    private postitService: PostitService
  ) {
    this.editedNote = data.editedNote;
  }

  public ngOnInit() {
  }

  public saveEdit() {
    const saveNote = new PostitNote();
    saveNote.id = this.editedNote.id;
    saveNote.name = this.editedNote.name;
    saveNote.text = this.editedNote.text;

    this.postitService.updateNote(saveNote).then(updatedNote => {
      this.dialogRef.close(updatedNote);
    });
  }

}
