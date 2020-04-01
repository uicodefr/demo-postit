import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { PostitService } from '../../service/postit/postit.service';
import { PostitNote } from '../../model/postit/postit-note';
import { Board } from '../../model/postit/board';
import { GlobalService } from '../../service/global/global.service';
import { GlobalConstant } from '../../const/global-constant';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ViewListComponent } from './view-list/view-list.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  public boardList: Array<Board>;
  public noteListMap = new Map<number, Array<PostitNote>>();

  public view: string;
  public selectedIndex = 0;

  public parameterNoteMax: number;

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private postitService: PostitService,
    private matBottomSheet: MatBottomSheet
  ) {}

  public ngOnInit(): void {
    this.globalService.getParameterValue(GlobalConstant.Parameter.NOTE_MAX).then(paramValue => {
      this.parameterNoteMax = Number(paramValue);
    });

    this.postitService.getBoardList().then(boardList => {
      this.boardList = boardList;
      this.route.params.subscribe(params => {
        this.view = params['view'];
        if (!this.boardList || this.boardList.length === 0) {
          return;
        }
        if (this.view === 'table') {
          // In view "table", we load all boards
          this.boardList.forEach(board => this.loadNoteList(board.id));
        } else if (this.view !== 'panels') {
          // In view "tabs" (default view), we load the selected tab
          if (params['id']) {
            const selectedBoardId = parseInt(params['id'], 10);
            this.loadNoteList(selectedBoardId);
            this.selectedIndex = this.boardList.findIndex(board => board.id === selectedBoardId);
          } else {
            this.router.navigate(['board', { id: '' + this.boardList[0].id }]);
          }
        }
      });
    });
  }

  public changeTabBoard(event: MatTabChangeEvent): void {
    if (event.index < this.boardList.length) {
      const currentBoard = this.boardList[event.index];
      this.router.navigate(['board', { id: '' + currentBoard.id }]);
    }
  }

  public loadNoteList(boardId: number): void {
    this.postitService.getNoteList(boardId).then(noteList => {
      this.noteListMap.set(boardId, noteList);
    });
  }

  public getOtherBoardList(boardId: number) {
    return this.boardList.filter(board => board.id !== boardId);
  }

  public openChangeView(): void {
    this.matBottomSheet.open(ViewListComponent);
  }
}
