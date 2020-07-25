import { Component, OnInit, Inject } from '@angular/core';
import { AttachedFile } from 'src/app/model/postit/attached-file';
import { AttachedFileService } from 'src/app/service/postit/attached-file.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertType } from 'src/app/const/alert-type';
import { GlobalInfoService } from 'src/app/service/util/global-info.service';

@Component({
  selector: 'app-attached-file-dialog',
  templateUrl: './attached-file-dialog.component.html',
  styleUrls: ['./attached-file-dialog.component.scss'],
})
export class AttachedFileDialogComponent implements OnInit {
  public constructor(
    private dialogRef: MatDialogRef<AttachedFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public attachedFile: AttachedFile,
    private attachedFileService: AttachedFileService,
    private globalInfoService: GlobalInfoService
  ) {}

  ngOnInit(): void {}

  public download() {
    if (!this.attachedFile) {
      return;
    }

    const newWindow = window.open();
    if (newWindow) {
      this.attachedFileService.downloadFile(this.attachedFile.id).then((blob) => {
        const urlBlob = window.URL.createObjectURL(blob);
        newWindow.location.href = urlBlob;
        this.dialogRef.close(false);
      });
    } else {
      // Backup solution
      window.open(this.attachedFileService.getDownloadLink(this.attachedFile.id), '_blank');
      this.dialogRef.close(false);
    }
  }

  public deleteFile() {
    if (!this.attachedFile) {
      return;
    }

    this.attachedFileService.deleteFile(this.attachedFile.id).then(() => {
      this.globalInfoService.showAlert(
        AlertType.SUCCESS,
        $localize`:@@attachedFile.attachmentDeleted:Attachment deleted`
      );
      this.dialogRef.close(true);
    });
  }
}
