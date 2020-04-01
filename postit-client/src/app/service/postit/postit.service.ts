import { Injectable } from '@angular/core';
import { UrlConstant } from '../../const/url-constant';
import { Board } from '../../model/postit/board';
import { PostitNote } from '../../model/postit/postit-note';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostitService {
  public constructor(private httpClient: HttpClient) {}

  // Boards

  public getBoardList(): Promise<Array<Board>> {
    return this.httpClient.get<Array<Board>>(UrlConstant.Postit.BOARDS).toPromise();
  }

  public createBoard(board: Board): Promise<Board> {
    return this.httpClient.post<Board>(UrlConstant.Postit.BOARDS, board).toPromise();
  }

  public updateBoard(board: Board): Promise<Board> {
    return this.httpClient.patch<Board>(UrlConstant.Postit.BOARDS + '/' + board.id, board).toPromise();
  }

  public deleteBoard(boardId: number): Promise<void> {
    return this.httpClient.delete<void>(UrlConstant.Postit.BOARDS + '/' + boardId).toPromise();
  }

  // Notes

  public getNoteList(boardId: number): Promise<Array<PostitNote>> {
    return this.httpClient
      .get<Array<PostitNote>>(UrlConstant.Postit.NOTES, { params: { boardId: '' + boardId } })
      .toPromise();
  }

  public getNote(noteId: number): Promise<PostitNote> {
    return this.httpClient.get<PostitNote>(UrlConstant.Postit.NOTES + '/' + noteId).toPromise();
  }

  public createNote(note: PostitNote): Promise<PostitNote> {
    return this.httpClient.post<PostitNote>(UrlConstant.Postit.NOTES, note).toPromise();
  }

  public updateNote(note: PostitNote): Promise<PostitNote> {
    return this.httpClient.patch<PostitNote>(UrlConstant.Postit.NOTES + '/' + note.id, note).toPromise();
  }

  public deleteNote(noteId: number): Promise<void> {
    return this.httpClient.delete<void>(UrlConstant.Postit.NOTES + '/' + noteId).toPromise();
  }
}
