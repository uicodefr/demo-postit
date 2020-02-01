import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';

import { PostitService } from '../../service/postit/postit.service';
import { PostitNote } from '../../model/postit/postit-note';
import { Board } from '../../model/postit/board';
import { GlobalInfoService } from '../../service/util/global-info.service';
import { AlertType } from '../../const/alert-type';
import { ArrayUtils } from '../../utils/array-utils';
import { TranslateService } from '../../service/util/translate.service';
import { GlobalService } from '../../service/global/global.service';
import { GlobalConstant } from '../../const/global-constant';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  public boardList: Array<Board>;
  public noteListMap = new Map<number, Array<PostitNote>>();

  public selectedIndex = 0;
  public currentBoard: Board;
  public otherBoardList: Array<Board> = [];

  public parameterNoteMax: number;

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalInfoService: GlobalInfoService,
    private translateService: TranslateService,
    private globalService: GlobalService,
    private postitService: PostitService
  ) { }

  public ngOnInit() {
    this.globalService.getParameterValue(GlobalConstant.Parameter.NOTE_MAX).then(paramValue => {
      this.parameterNoteMax = Number(paramValue);
    });

    this.postitService.getBoardList().then(boardList => {
      this.boardList = boardList;

      this.route.params.subscribe(routeParams => {
        const selectedBoardId = parseInt(routeParams['id'], 10);
        this.selectedIndex = this.boardList.findIndex(board => board.id === selectedBoardId);
      });
    });
  }

  public changeBoard(event: MatTabChangeEvent) {
    if (event.index < this.boardList.length) {
      this.currentBoard = this.boardList[event.index];
      this.otherBoardList = this.boardList.filter(board => board.id !== this.currentBoard.id);
      this.loadNoteList(this.currentBoard.id);
      this.router.navigate(['board', this.currentBoard.id]);
    }
  }

  private loadNoteList(boardId: number) {
    this.postitService.getNoteList(boardId).then(noteList => {
      this.noteListMap.set(boardId, noteList);
    });
  }

  public refreshCurrentBoard() {
    this.loadNoteList(this.currentBoard.id);
  }

  public addNote(board: Board) {
    const newNote = new PostitNote();
    newNote.boardId = board.id;
    newNote.name = this.translateService.get('New note');

    this.postitService.createNote(newNote).then(noteCreated => {
      this.noteListMap.get(board.id).push(noteCreated);
      this.globalInfoService.showAlert(AlertType.SUCCESS, this.translateService.get('New note created'));

      this.loadNoteList(board.id);
    });
  }

  public reorderBoard(note: PostitNote) {
    let orderNum = 1;
    for (const noteOfBoard of this.noteListMap.get(note.boardId)) {
      if (noteOfBoard.id === note.id) {
        noteOfBoard.orderNum = note.orderNum;
      } else {
        if (note.orderNum === orderNum) {
          orderNum++;
        }
        noteOfBoard.orderNum = orderNum++;
      }
    }

    this.noteListMap.get(note.boardId).sort((note1, note2) => {
      return note1.orderNum - note2.orderNum;
    });

    this.loadNoteList(note.boardId);
  }

  public takeOffNote(note: PostitNote) {
    const noteList = this.noteListMap.get(note.boardId);
    ArrayUtils.removeElement(noteList, value => {
      return value.id === note.id;
    });

    this.loadNoteList(note.boardId);
  }

}
