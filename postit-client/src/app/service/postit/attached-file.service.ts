import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlConstant } from 'src/app/const/url-constant';
import { AttachedFile } from 'src/app/model/postit/attached-file';

@Injectable({
  providedIn: 'root',
})
export class AttachedFileService {
  constructor(private httpClient: HttpClient) {}

  public uploadFile(file: File, noteId: number): Promise<AttachedFile> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.httpClient
      .put<AttachedFile>(`${UrlConstant.Postit.NOTES}/${noteId}/attached-file`, formData)
      .toPromise();
  }

  public getDownloadLink(attachedFileId: number) {
    return `${UrlConstant.Postit.ATTACHED_FILES}/${attachedFileId}/content`;
  }

  public downloadFile(attachedFileId: number): Promise<Blob> {
    return this.httpClient.get(this.getDownloadLink(attachedFileId), { responseType: 'blob' }).toPromise();
  }

  public deleteFile(attachedFileId: number): Promise<void> {
    return this.httpClient.delete<void>(UrlConstant.Postit.ATTACHED_FILES + '/' + attachedFileId).toPromise();
  }
}
