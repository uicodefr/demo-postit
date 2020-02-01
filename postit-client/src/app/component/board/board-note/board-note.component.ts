import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PostitNote } from '../../../model/postit/postit-note';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/dialog/confirm-dialog/confirm-dialog.component';
import { PostitService } from '../../../service/postit/postit.service';
import { GlobalInfoService } from '../../../service/util/global-info.service';
import { AlertType } from '../../../const/alert-type';
import { TranslateService } from '../../../service/util/translate.service';
import { EditNoteDialogComponent } from '../edit-note-dialog/edit-note-dialog.component';
import { GlobalConstant } from '../../../const/global-constant';
import { ColorizeNoteDialogComponent } from '../colorize-note-dialog/colorize-note-dialog.component';
import { Board } from 'src/app/model/postit/board';

@Component({
  selector: 'app-board-note',
  templateUrl: './board-note.component.html',
  styleUrls: ['./board-note.component.scss']
})
export class BoardNoteComponent implements OnInit {

  @Input()
  public note: PostitNote;
  @Input()
  public otherBoardList: Array<Board> = [];

  @Output()
  public takeOffNote = new EventEmitter<PostitNote>();
  @Output()
  public changeNote = new EventEmitter<PostitNote>();
  @Output()
  public orderNote = new EventEmitter<PostitNote>();

  public constructor(
    private dialog: MatDialog,
    private globalInfoService: GlobalInfoService,
    private translateService: TranslateService,
    private postitService: PostitService
  ) {
    this.note = new PostitNote();
  }

  public ngOnInit() {
  }

  public getColorClass(): string {
    if (GlobalConstant.Functional.VALID_COLOR_LIST.includes(this.note.color)) {
      return this.note.color;
    } else {
      return GlobalConstant.Functional.DEFAULT_COLOR;
    }
  }

  public changeOrder(orderIncrement: number) {
    const saveNote = new PostitNote();
    saveNote.id = this.note.id;
    saveNote.orderNum = this.note.orderNum + orderIncrement;

    this.postitService.updateNote(saveNote).then(updatedNote => {
      this.note = updatedNote;
      this.orderNote.emit(this.note);
    });
  }

  public edit() {
    this.postitService.getNote(this.note.id).then(editedNote => {
      const editDialog = this.dialog.open(EditNoteDialogComponent, {
        width: GlobalConstant.Display.DIALOG_WIDTH,
        data: {
          editedNote: editedNote
        }
      });

      editDialog.afterClosed().subscribe(updatedNote => {
        this.changeNoteAfterUpdate(updatedNote, 'Note updated');
      });
    });
  }

  public changeColor() {
    const colorDialog = this.dialog.open(ColorizeNoteDialogComponent, {
      width: GlobalConstant.Display.DIALOG_WIDTH,
      data: {
        noteId: this.note.id
      }
    });

    colorDialog.afterClosed().subscribe(updatedNote => {
      this.changeNoteAfterUpdate(updatedNote);
    });
  }

  public changeToBoard(board: Board) {
    const moveNote = new PostitNote();
    moveNote.id = this.note.id;
    moveNote.boardId = board.id;

    this.postitService.updateNote(moveNote).then(updatedNote => {
      this.globalInfoService.showAlert(AlertType.SUCCESS, this.translateService.get('Note moved'));
      this.changeNote.emit(null);
    });
  }

  public deleteNote() {
    const confirmDialogData = {
      title: this.translateService.get('Delete note'),
      message: this.translateService.get('Are you sure to delete this note ?'),
      confirm: this.translateService.get('Delete'),
    } as ConfirmDialogData;

    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      width: GlobalConstant.Display.DIALOG_WIDTH,
      data: confirmDialogData
    });

    confirmDialog.afterClosed().subscribe(confirmation => {
      if (confirmation === true) {
        this.postitService.deleteNote(this.note.id).then(() => {
          this.globalInfoService.showAlert(AlertType.SUCCESS, this.translateService.get('Note deleted'));
          this.takeOffNote.emit(this.note);
        });
      }
    });
  }

  private changeNoteAfterUpdate(updatedNote: PostitNote, message?: string) {
    if (updatedNote) {
      Object.assign(this.note, updatedNote);
      this.changeNote.emit(this.note);
      if (message) {
        this.globalInfoService.showAlert(AlertType.SUCCESS, this.translateService.get(message));
      }
    }
  }

}