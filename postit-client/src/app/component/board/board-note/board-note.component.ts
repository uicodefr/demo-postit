import { Component, OnInit, computed, effect, inject, input, output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PostitNote } from '@app/model/postit/postit-note';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '@app/component/shared/dialog/confirm-dialog/confirm-dialog.component';
import { PostitService } from '@app/service/postit/postit.service';
import { GlobalInfoService } from '@app/service/util/global-info.service';
import { AlertType } from '@app/const/alert-type';
import { EditNoteDialogComponent } from '@app/component/board/edit-note-dialog/edit-note-dialog.component';
import { GlobalConstant } from '@app/const/global-constant';
import { ColorizeNoteDialogComponent } from '@app/component/board//colorize-note-dialog/colorize-note-dialog.component';
import { Board } from '@app/model/postit/board';
import { AttachedFileService } from '@app/service/postit/attached-file.service';
import { AttachedFileDialogComponent } from '@app/component/board//attached-file-dialog/attached-file-dialog.component';
import { GlobalService } from '@app/service/global/global.service';
import { MatCardModule } from '@angular/material/card';
import { SHARED_COMMON, SHARED_MATERIAL } from '@app/common-imports';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-board-note',
  imports: [SHARED_COMMON, SHARED_MATERIAL, MatCardModule, MatMenuModule],
  templateUrl: './board-note.component.html',
  styleUrls: ['./board-note.component.scss'],
})
export class BoardNoteComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly globalInfoService = inject(GlobalInfoService);
  private readonly globalService = inject(GlobalService);
  private readonly postitService = inject(PostitService);
  private readonly attachedFileService = inject(AttachedFileService);

  private parameterUploadSizeMax = 0;

  public note = input<PostitNote>({} as PostitNote);
  public otherBoardList = input<Board[]>([]);

  public changeNote = output<PostitNote>();
  public orderNote = output<PostitNote>();
  public moveNote = output<PostitNote>();
  public deleteNote = output<PostitNote>();

  public localChangedNote = signal<PostitNote | null>(null);

  constructor() {
    effect(() => {
      this.note();
      this.localChangedNote.set(null);
    });
  }

  public validNote = computed(() => {
    const localNote = this.localChangedNote();
    if (localNote) {
      return localNote;
    }
    return this.note();
  });

  public colorClass = computed(() => {
    if (this.validNote().color && GlobalConstant.Functional.VALID_COLOR_LIST.includes(this.validNote().color)) {
      return this.validNote().color;
    } else {
      return GlobalConstant.Functional.DEFAULT_COLOR;
    }
  });

  public ngOnInit(): void {
    this.globalService.getParameterValue(GlobalConstant.Parameter.UPLOAD_SIZE_MAX).subscribe((parameterValue) => {
      this.parameterUploadSizeMax = Number(parameterValue);
    });
  }

  public changeOrder(orderIncrement: number): void {
    const saveNote = {} as PostitNote;
    saveNote.id = this.validNote().id;
    saveNote.orderNum = (this.validNote().orderNum ? this.validNote().orderNum : 0) + orderIncrement;

    this.postitService.updateNote(saveNote).subscribe((updatedNote) => {
      this.localChangedNote.set(updatedNote);
      this.orderNote.emit(updatedNote);
    });
  }

  public changeToBoard(board: Board): void {
    const moveNote = {} as PostitNote;
    moveNote.id = this.validNote().id;
    moveNote.boardId = board.id;

    this.postitService.updateNote(moveNote).subscribe((updatedNote) => {
      this.globalInfoService.showAlert(AlertType.SUCCESS, $localize`:@@boardNote.noteMoved:Note moved`);
      this.moveNote.emit(updatedNote);
    });
  }

  public edit(): void {
    if (!this.validNote().id) {
      return;
    }

    this.postitService.getNote(this.validNote().id).subscribe((editedNote) => {
      const editDialog = this.dialog.open(EditNoteDialogComponent, {
        width: GlobalConstant.Display.DIALOG_WIDTH,
        data: {
          editedNote,
        },
      });

      editDialog.afterClosed().subscribe((updatedNote) => {
        this.changeNoteAfterUpdate(updatedNote, $localize`:@@boardNote.noteUpdated:Note updated`);
      });
    });
  }

  public changeColor(): void {
    const colorDialog = this.dialog.open(ColorizeNoteDialogComponent, {
      width: GlobalConstant.Display.DIALOG_WIDTH,
      data: {
        noteId: this.validNote().id,
      },
    });

    colorDialog.afterClosed().subscribe((updatedNote) => {
      this.changeNoteAfterUpdate(updatedNote);
    });
  }

  public viewAttachedFile(): void {
    const attachedFileDialog = this.dialog.open(AttachedFileDialogComponent, {
      width: GlobalConstant.Display.DIALOG_WIDTH,
      data: this.validNote().attachedFile,
    });

    attachedFileDialog.afterClosed().subscribe((deleteAttachedFile) => {
      if (deleteAttachedFile) {
        const noteWithDeletedFile = { ...this.validNote(), attachedFile: null } as PostitNote;
        this.localChangedNote.set(noteWithDeletedFile);
        this.changeNote.emit(noteWithDeletedFile);
      }
    });
  }

  public uploadFile(eventUpload: HTMLInputElement): void {
    const uploadFile = eventUpload?.files;
    if (uploadFile?.length !== 1) {
      this.globalInfoService.showAlert(
        AlertType.WARNING,
        $localize`:@@boardNote.fileNotSelected:Please select one file`,
      );
      return;
    }
    if (uploadFile[0].size > this.parameterUploadSizeMax) {
      this.globalInfoService.showAlert(AlertType.WARNING, $localize`:@@boardNote.fileTooLarge:The file is too large`);
      return;
    }

    if (uploadFile && uploadFile.length > 0 && this.validNote().id) {
      this.attachedFileService.uploadFile(uploadFile[0], this.validNote().id).subscribe((attachedFile) => {
        const noteWithAttachedFile = { ...this.validNote(), attachedFile } as PostitNote;
        this.localChangedNote.set(noteWithAttachedFile);
        this.changeNoteAfterUpdate(noteWithAttachedFile, $localize`:@@boardNote.fileUploaded:File uploaded`);
      });
    }
  }

  public deleteNoteAfterConfirm(): void {
    const confirmDialogData = {
      title: $localize`:@@boardNote.deleteNote:Delete note`,
      message: $localize`:@@boardNote.deleteNoteConfirm:Are you sure to delete this note ?`,
      confirm: $localize`:@@global.delete:Delete`,
    } as ConfirmDialogData;

    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      width: GlobalConstant.Display.DIALOG_WIDTH,
      data: confirmDialogData,
    });

    confirmDialog.afterClosed().subscribe((confirmation) => {
      if (confirmation === true && this.validNote().id) {
        this.postitService.deleteNote(this.validNote().id).subscribe(() => {
          this.globalInfoService.showAlert(AlertType.SUCCESS, $localize`:@@boardNote.noteDeleted:Note deleted`);
          this.deleteNote.emit(this.validNote());
        });
      }
    });
  }

  private changeNoteAfterUpdate(updatedNote: PostitNote, message?: string): void {
    if (updatedNote) {
      this.localChangedNote.set(updatedNote);
      this.changeNote.emit(updatedNote);
      if (message) {
        this.globalInfoService.showAlert(AlertType.SUCCESS, message);
      }
    }
  }
}
