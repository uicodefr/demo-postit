import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlConstant } from '@app/const/url-constant';
import { Board } from '@app/model/postit/board';
import { PostitNote } from '@app/model/postit/postit-note';

@Injectable({
  providedIn: 'root',
})
export class PostitService {
  private readonly httpClient = inject(HttpClient);

  // Boards

  public getBoardList(): Observable<Board[]> {
    return this.httpClient.get<Board[]>(UrlConstant.Postit.BOARDS);
  }

  public createBoard(board: Board): Observable<Board> {
    return this.httpClient.post<Board>(UrlConstant.Postit.BOARDS, board);
  }

  public updateBoard(board: Board): Observable<Board> {
    return this.httpClient.patch<Board>(UrlConstant.Postit.BOARDS + '/' + board.id, board);
  }

  public deleteBoard(boardId: number): Observable<void> {
    return this.httpClient.delete<void>(UrlConstant.Postit.BOARDS + '/' + boardId);
  }

  // Notes

  public getNoteList(boardId: number): Observable<PostitNote[]> {
    return this.httpClient.get<PostitNote[]>(UrlConstant.Postit.NOTES, { params: { boardId: '' + boardId } });
  }

  public getNote(noteId: number): Observable<PostitNote> {
    return this.httpClient.get<PostitNote>(UrlConstant.Postit.NOTES + '/' + noteId);
  }

  public createNote(note: PostitNote): Observable<PostitNote> {
    return this.httpClient.post<PostitNote>(UrlConstant.Postit.NOTES, note);
  }

  public updateNote(note: PostitNote): Observable<PostitNote> {
    return this.httpClient.patch<PostitNote>(UrlConstant.Postit.NOTES + '/' + note.id, note);
  }

  public deleteNote(noteId: number): Observable<void> {
    return this.httpClient.delete<void>(UrlConstant.Postit.NOTES + '/' + noteId);
  }
}
