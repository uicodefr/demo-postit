import { Component, inject } from '@angular/core';
import { AttachedFile } from '@app/model/postit/attached-file';
import { AttachedFileService } from '@app/service/postit/attached-file.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AlertType } from '@app/const/alert-type';
import { GlobalInfoService } from '@app/service/util/global-info.service';
import { SHARED_MATERIAL } from '@app/common-imports';

@Component({
  selector: 'app-attached-file-dialog',
  imports: [SHARED_MATERIAL, MatDialogModule],
  templateUrl: './attached-file-dialog.component.html',
  styleUrls: ['./attached-file-dialog.component.scss'],
})
export class AttachedFileDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AttachedFileDialogComponent>);
  private readonly attachedFileService = inject(AttachedFileService);
  private readonly globalInfoService = inject(GlobalInfoService);

  public attachedFile = inject<AttachedFile>(MAT_DIALOG_DATA);

  public download(): void {
    if (!this.attachedFile.id) {
      return;
    }

    // Solution that always works even with add blocker
    window.open(this.attachedFileService.getDownloadLink(this.attachedFile.id), '_blank');
    this.dialogRef.close(false);
  }

  public deleteFile(): void {
    if (!this.attachedFile?.id) {
      return;
    }

    this.attachedFileService.deleteFile(this.attachedFile.id).subscribe(() => {
      this.globalInfoService.showAlert(
        AlertType.SUCCESS,
        $localize`:@@attachedFile.attachmentDeleted:Attachment deleted`,
      );
      this.dialogRef.close(true);
    });
  }
}
