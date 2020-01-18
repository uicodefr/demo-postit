import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Board } from 'src/app/shared/model/postit/board';
import { PostitService } from 'src/app/shared/service/postit/postit.service';
import { TranslateService } from 'src/app/shared/service/util/translate.service';
import { ConfirmDialogData, ConfirmDialogComponent } from 'src/app/shared/component/dialog/confirm-dialog/confirm-dialog.component';
import { GlobalConstant } from 'src/app/shared/const/global-constant';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalInfoService } from 'src/app/shared/service/util/global-info.service';
import { AlertType } from 'src/app/shared/const/alert-type';

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
    private globalInfoService: GlobalInfoService,
    private translateService: TranslateService
  ) { }

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
      this.globalInfoService.showAlert(AlertType.SUCCESS, this.translateService.get('Board updated'));
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
          this.globalInfoService.showAlert(AlertType.SUCCESS, this.translateService.get('Board deleted'));
          this.getBoardList();
        });
      }
    });
  }

  public createBoard() {
    const newBoard = new Board();
    newBoard.name = this.translateService.get('New board');

    this.postitService.createBoard(newBoard).then(createdBoard => {
      this.globalInfoService.showAlert(AlertType.SUCCESS, this.translateService.get('Board created'));
      this.getBoardList();
    });
  }

}
