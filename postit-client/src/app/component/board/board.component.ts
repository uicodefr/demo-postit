import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { PostitService } from '@app/service/postit/postit.service';
import { PostitNote } from '@app/model/postit/postit-note';
import { Board } from '@app/model/postit/board';
import { GlobalService } from '@app/service/global/global.service';
import { GlobalConstant } from '@app/const/global-constant';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { ViewListComponent } from './view-list/view-list.component';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AlertType } from '@app/const/alert-type';
import { GlobalInfoService } from '@app/service/util/global-info.service';
import { BoardPanelComponent } from './board-panel/board-panel.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SHARED_COMMON, SHARED_MATERIAL } from '@app/common-imports';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-board',
  imports: [
    SHARED_COMMON,
    SHARED_MATERIAL,
    BoardPanelComponent,
    MatTabsModule,
    MatExpansionModule,
    DragDropModule,
    MatBottomSheetModule,
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly globalService = inject(GlobalService);
  private readonly postitService = inject(PostitService);
  private readonly globalInfoService = inject(GlobalInfoService);
  private readonly matBottomSheet = inject(MatBottomSheet);

  public boardList = signal<Board[]>([]);
  public boardLoadingMap = signal(new Map<number, boolean>());
  public noteListMap = signal(new Map<number, PostitNote[]>());

  public activeView = signal('tabs');
  public selectedIndex = signal(0);
  public parameterNoteMax = signal(0);

  public ngOnInit(): void {
    this.globalService.getParameterValue(GlobalConstant.Parameter.NOTE_MAX).subscribe((paramValue) => {
      this.parameterNoteMax.set(Number(paramValue));
    });

    this.postitService.getBoardList().subscribe((boardList) => {
      this.boardList.set(boardList);
      this.route.params.subscribe((params) => {
        const paramView = params['view'];
        this.activeView.set(paramView);
        if (!this.boardList().length) {
          return;
        }
        if (paramView === 'table') {
          // In view "table", we load all boards
          this.boardList().forEach((board) => {
            if (board.id) {
              this.loadNoteList(board.id);
            }
          });
        } else if (paramView !== 'panels') {
          // In view "tabs" (default view), we load the selected tab
          if (params['id']) {
            const selectedBoardId = Number.parseInt(params['id'], 10);
            this.loadNoteList(selectedBoardId);
            this.selectedIndex.set(this.boardList().findIndex((board) => board.id === selectedBoardId));
          } else {
            this.router.navigate(['board', { id: '' + this.boardList()[0].id }]);
          }
        }
      });
    });
  }

  public changeTabBoard(event: MatTabChangeEvent): void {
    if (event.index < this.boardList().length) {
      const currentBoard = this.boardList()[event.index];
      this.router.navigate(['board', { id: '' + currentBoard.id }]);
    }
  }

  public loadNoteList(boardId: number | undefined): void {
    if (!boardId) {
      return;
    }

    this.setBoardLoading(boardId, true);
    this.postitService
      .getNoteList(boardId)
      .pipe(finalize(() => this.setBoardLoading(boardId, false)))
      .subscribe((noteList) => {
        const newNoteMap = new Map(this.noteListMap());
        newNoteMap.set(boardId, noteList);
        this.noteListMap.set(newNoteMap);
      });
  }

  private setBoardLoading(boardId: number, loading: boolean) {
    const newLoadingMap = new Map(this.boardLoadingMap());
    newLoadingMap.set(boardId, loading);
    this.boardLoadingMap.set(newLoadingMap);
  }

  public getNoteList(boardId: number): PostitNote[] {
    const noteList = this.noteListMap().get(boardId);
    if (!noteList) {
      return [];
    }
    return noteList;
  }

  public getIsBoardLoading(boardId: number): boolean {
    return !!this.boardLoadingMap().get(boardId);
  }

  public getOtherBoardList(boardId: number): Board[] {
    return this.boardList().filter((board) => board.id !== boardId);
  }

  public openChangeView(): void {
    this.matBottomSheet.open(ViewListComponent, {
      data: { currentView: this.activeView() },
    });
  }

  public dropNote(event: CdkDragDrop<Board>): void {
    const originBoard = event.previousContainer.data;
    const destinationBoard = event.container.data;
    if (!originBoard.id || !destinationBoard.id) {
      return;
    }

    const draggedNote = event.item.data as PostitNote;
    const note = {} as PostitNote;
    note.id = draggedNote.id;
    note.boardId = destinationBoard.id;
    note.orderNum = event.currentIndex + 1;

    // Move the note before the update for avoid clipping with drag and drop
    const noteArray = this.noteListMap().get(destinationBoard.id);
    if (event.previousContainer === event.container) {
      if (noteArray) {
        moveItemInArray(noteArray, event.previousIndex, event.currentIndex);
      }
    } else {
      const previousNoteArray = this.noteListMap().get(originBoard.id);
      if (noteArray && previousNoteArray) {
        transferArrayItem(previousNoteArray, noteArray, event.previousIndex, event.currentIndex);
      }
    }

    this.postitService.updateNote(note).subscribe(() => {
      this.globalInfoService.showAlert(
        AlertType.SUCCESS,
        $localize`:@@board.noteMovedWithDragAndDrop:Note moved with drag-and-drop`,
      );
      if (!originBoard.id || !destinationBoard.id) {
        return;
      }

      this.loadNoteList(destinationBoard.id);
      if (originBoard.id !== destinationBoard.id) {
        this.loadNoteList(originBoard.id);
      }
    });
  }
}
