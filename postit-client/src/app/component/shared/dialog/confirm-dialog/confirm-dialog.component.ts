import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SHARED_MATERIAL } from '@app/common-imports';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirm: string;
  cancel: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [SHARED_MATERIAL, MatDialogModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  public readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  public readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
