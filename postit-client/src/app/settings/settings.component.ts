import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { PostitService } from '../shared/service/postit/postit.service';
import { Board } from '../shared/model/postit/board';
import { TranslateService } from '../shared/service/utils/translate.service';
import { ConfirmDialogData, ConfirmDialogComponent } from '../shared/component/dialog/confirm-dialog/confirm-dialog.component';
import { GlobalConstant } from '../shared/const/global-constant';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public boardList: Array<Board>;

  public constructor(
    private dialog: MatDialog,
    private postitService: PostitService,
    private translateService: TranslateService
  ) { }

  public ngOnInit() {
    this.getBoardList();
  }

  private getBoardList() {
    this.postitService.getBoardList().then(boardList => {
      this.boardList = boardList;
    });
  }

  public saveBoard(board: Board) {
    this.postitService.updateBoard(board).then(updatedBoard => {
      this.getBoardList();
    });
  }

  public deleteBoard(board: Board) {
    const confirmDialogData = {
      title: this.translateService.get('Delete board'),
      message: this.translateService.get('Are you sure to delete this board ?'),
      confirm: this.translateService.get('Delete'),
    } as ConfirmDialogData;

    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      width: GlobalConstant.Display.DIALOG_WIDTH,
      data: confirmDialogData
    });

    confirmDialog.afterClosed().subscribe(confirmation => {
      if (confirmation === true) {
        this.postitService.deleteBoard(board.id).then(() => {
          this.getBoardList();
        });
      }
    });
  }

  public createBoard() {
    const newBoard = new Board();
    newBoard.name = this.translateService.get('New board');

    this.postitService.createBoard(newBoard).then(createdBoard => {
      this.getBoardList();
    });
  }

}
