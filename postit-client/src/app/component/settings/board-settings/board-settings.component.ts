import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Board } from 'src/app/model/postit/board';
import { PostitService } from 'src/app/service/postit/postit.service';
import {
  ConfirmDialogData,
  ConfirmDialogComponent
} from 'src/app/component/shared/dialog/confirm-dialog/confirm-dialog.component';
import { GlobalConstant } from 'src/app/const/global-constant';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalInfoService } from 'src/app/service/util/global-info.service';
import { AlertType } from 'src/app/const/alert-type';

@Component({
  selector: 'app-board-settings',
  templateUrl: './board-settings.component.html',
  styleUrls: ['./board-settings.component.scss']
})
export class BoardSettingsComponent implements OnInit {
  public displayedColumns = ['id', 'name', 'actions'];
  public dataSource = new MatTableDataSource<Board>();
  @ViewChild(MatPaginator, { static: true })
  public paginator: MatPaginator;

  public constructor(
    private dialog: MatDialog,
    private postitService: PostitService,
    private globalInfoService: GlobalInfoService
  ) {}

  public ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.getBoardList();
  }

  public refresh() {
    this.getBoardList();
  }

  private getBoardList() {
    this.postitService.getBoardList().then(boardList => {
      this.dataSource.data = boardList;
    });
  }

  public isValidForSave(board: Board): boolean {
    return board && board.name && board.name.length > 1;
  }

  public saveBoard(board: Board) {
    if (!this.isValidForSave(board)) {
      return;
    }
    this.postitService.updateBoard(board).then(updatedBoard => {
      this.globalInfoService.showAlert(AlertType.SUCCESS, $localize`:@@boardSettings.boardUpdated:Board updated`);
      this.getBoardList();
    });
  }

  public deleteBoard(board: Board) {
    const confirmDialogData = {
      title: $localize`:@@boardSettings.deleteBoard:Delete board`,
      message: $localize`:@@boardSettings.deleteBoardConfirm:Are you sure to delete this board ?`,
      confirm: $localize`:@@global.delete:Delete`
    } as ConfirmDialogData;

    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      width: GlobalConstant.Display.DIALOG_WIDTH,
      data: confirmDialogData
    });

    confirmDialog.afterClosed().subscribe(confirmation => {
      if (confirmation === true) {
        this.postitService.deleteBoard(board.id).then(() => {
          this.globalInfoService.showAlert(AlertType.SUCCESS, $localize`:@@boardSettings.boardDeleted:Board deleted`);
          this.getBoardList();
        });
      }
    });
  }

  public createBoard() {
    const newBoard = new Board();
    newBoard.name = $localize`:@@boardSettings.newBoard:New board`;

    this.postitService.createBoard(newBoard).then(createdBoard => {
      this.globalInfoService.showAlert(AlertType.SUCCESS, $localize`:@@boardSettings.boardCreated:Board created`);
      this.getBoardList();
    });
  }
}
