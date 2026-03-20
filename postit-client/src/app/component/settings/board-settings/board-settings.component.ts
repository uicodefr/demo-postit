import { Component, inject, OnInit, viewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Board } from '@app/model/postit/board';
import { PostitService } from '@app/service/postit/postit.service';
import {
  ConfirmDialogData,
  ConfirmDialogComponent,
} from '@app/component/shared/dialog/confirm-dialog/confirm-dialog.component';
import { GlobalConstant } from '@app/const/global-constant';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GlobalInfoService } from '@app/service/util/global-info.service';
import { AlertType } from '@app/const/alert-type';
import { SHARED_FORM, SHARED_MATERIAL } from '@app/common-imports';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-board-settings',
  imports: [SHARED_FORM, SHARED_MATERIAL, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule],
  templateUrl: './board-settings.component.html',
  styleUrls: ['./board-settings.component.scss'],
})
export class BoardSettingsComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly postitService = inject(PostitService);
  private readonly globalInfoService = inject(GlobalInfoService);

  public readonly paginator = viewChild(MatPaginator);

  public displayedColumns = ['id', 'name', 'order', 'actions'];
  public dataSource = new MatTableDataSource<Board>();

  public ngOnInit(): void {
    if (this.paginator()) {
      this.dataSource.paginator = this.paginator();
    }
    this.getBoardList();
  }

  public refresh(): void {
    this.getBoardList();
  }

  public isValidForSave(board: Board): boolean {
    return !!(board?.name && board.name.length > 1);
  }

  public saveBoard(board: Board): void {
    if (!this.isValidForSave(board)) {
      return;
    }
    this.postitService.updateBoard(board).subscribe(() => {
      this.globalInfoService.showAlert(AlertType.SUCCESS, $localize`:@@boardSettings.boardUpdated:Board updated`);
      this.getBoardList();
    });
  }

  public deleteBoard(board: Board): void {
    const confirmDialogData = {
      title: $localize`:@@boardSettings.deleteBoard:Delete board`,
      message: $localize`:@@boardSettings.deleteBoardConfirm:Are you sure to delete this board ?`,
      confirm: $localize`:@@global.delete:Delete`,
    } as ConfirmDialogData;

    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      width: GlobalConstant.Display.DIALOG_WIDTH,
      data: confirmDialogData,
    });

    confirmDialog.afterClosed().subscribe((confirmation) => {
      if (confirmation === true && board.id) {
        this.postitService.deleteBoard(board.id).subscribe(() => {
          this.globalInfoService.showAlert(AlertType.SUCCESS, $localize`:@@boardSettings.boardDeleted:Board deleted`);
          this.getBoardList();
        });
      }
    });
  }

  public createBoard(): void {
    const newBoard = {} as Board;
    newBoard.name = $localize`:@@boardSettings.newBoard:New board`;

    this.postitService.createBoard(newBoard).subscribe(() => {
      this.globalInfoService.showAlert(AlertType.SUCCESS, $localize`:@@boardSettings.boardCreated:Board created`);
      this.getBoardList();
    });
  }

  private getBoardList(): void {
    this.postitService.getBoardList().subscribe((boardList) => {
      this.dataSource.data = boardList;
    });
  }
}
