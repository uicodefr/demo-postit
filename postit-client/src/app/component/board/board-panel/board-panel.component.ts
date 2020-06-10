import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalInfoService } from 'src/app/service/util/global-info.service';
import { PostitService } from 'src/app/service/postit/postit.service';
import { AlertType } from 'src/app/const/alert-type';
import { PostitNote } from 'src/app/model/postit/postit-note';
import { ArrayUtil } from 'src/app/util/array-util';
import { Board } from 'src/app/model/postit/board';

@Component({
  selector: 'app-board-panel',
  templateUrl: './board-panel.component.html',
  styleUrls: ['./board-panel.component.scss'],
})
export class BoardPanelComponent implements OnInit {
  @Input()
  public board: Board;

  @Input()
  public noteList: Array<PostitNote> = [];

  @Input()
  public otherBoardList: Array<Board> = [];

  @Input()
  public parameterNoteMax: number;

  @Input()
  public noteDraggable = false;

  @Output()
  public askRefreshBoard = new EventEmitter<number>();

  constructor(private globalInfoService: GlobalInfoService, private postitService: PostitService) {}

  public ngOnInit(): void {}

  public refreshCurrentBoard(): void {
    this.askRefreshBoard.next(this.board.id);
  }

  public addNote(): void {
    const newNote = new PostitNote();
    newNote.boardId = this.board.id;
    newNote.name = $localize`:@@board.newNote:New note`;

    this.postitService.createNote(newNote).then((noteCreated) => {
      this.noteList.push(noteCreated);
      this.globalInfoService.showAlert(AlertType.SUCCESS, $localize`:@@board.newNoteCreated:New note created`);

      this.refreshCurrentBoard();
    });
  }

  public reorderBoard(note: PostitNote): void {
    let orderNum = 1;
    for (const noteOfBoard of this.noteList) {
      if (noteOfBoard.id === note.id) {
        noteOfBoard.orderNum = note.orderNum;
      } else {
        if (note.orderNum === orderNum) {
          orderNum++;
        }
        noteOfBoard.orderNum = orderNum++;
      }
    }

    this.noteList.sort((note1, note2) => {
      return note1.orderNum - note2.orderNum;
    });

    this.refreshCurrentBoard();
  }

  public takeOffNote(note: PostitNote): void {
    const noteList = this.noteList;
    ArrayUtil.removeElement(noteList, (value) => {
      return value.id === note.id;
    });

    this.refreshCurrentBoard();
  }

  public moveNote(note: PostitNote): void {
    this.refreshCurrentBoard();
    this.askRefreshBoard.next(note.boardId);
  }
}
