import { Component, inject, input, output } from '@angular/core';
import { GlobalInfoService } from '@app/service/util/global-info.service';
import { PostitService } from '@app/service/postit/postit.service';
import { AlertType } from '@app/const/alert-type';
import { PostitNote } from '@app/model/postit/postit-note';
import { Board } from '@app/model/postit/board';
import { SHARED_MATERIAL } from '@app/common-imports';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BoardNoteComponent } from '@app/component/board/board-note/board-note.component';

@Component({
  selector: 'app-board-panel',
  imports: [SHARED_MATERIAL, MatCardModule, DragDropModule, BoardNoteComponent],
  templateUrl: './board-panel.component.html',
  styleUrls: ['./board-panel.component.scss'],
})
export class BoardPanelComponent {
  private readonly globalInfoService = inject(GlobalInfoService);
  private readonly postitService = inject(PostitService);

  public board = input<Board>({} as Board);
  public noteList = input<PostitNote[]>([]);
  public otherBoardList = input<Board[]>([]);
  public parameterNoteMax = input(0);
  public noteDraggable = input(false);

  public askRefreshBoard = output<number>();

  public refreshCurrentBoard(): void {
    this.askRefreshBoard.emit(this.board().id);
  }

  public addNote(): void {
    const newNote = {} as PostitNote;
    newNote.boardId = this.board().id;
    newNote.name = $localize`:@@board.newNote:New note`;

    this.postitService.createNote(newNote).subscribe((noteCreated) => {
      this.noteList().push(noteCreated);
      this.globalInfoService.showAlert(AlertType.SUCCESS, $localize`:@@board.newNoteCreated:New note created`);

      this.refreshCurrentBoard();
    });
  }

  public reorderBoard(note: PostitNote): void {
    let orderNum = 1;
    for (const noteOfBoard of this.noteList()) {
      if (noteOfBoard.id === note.id) {
        noteOfBoard.orderNum = note.orderNum;
      } else {
        if (note.orderNum === orderNum) {
          orderNum++;
        }
        noteOfBoard.orderNum = orderNum++;
      }
    }

    this.noteList().sort(
      (note1, note2) => (note1.orderNum ? note1.orderNum : 0) - (note2.orderNum ? note2.orderNum : 0),
    );

    this.refreshCurrentBoard();
  }

  public moveNote(note: PostitNote): void {
    this.refreshCurrentBoard();
    this.askRefreshBoard.emit(note.boardId);
  }
}
