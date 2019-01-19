import { Injectable } from '@angular/core';

import { RestClientService } from '../utils/rest-client.service';
import { UrlConstant } from '../../const/url-constant';
import { Board } from '../../model/postit/board';
import { PostitNote } from '../../model/postit/postit-note';

@Injectable({
  providedIn: 'root'
})
export class PostitService {

  public constructor(
    private restClientService: RestClientService
  ) { }

  // Boards

  public getBoardList(): Promise<Array<Board>> {
    return this.restClientService.get<Array<Board>>(UrlConstant.Postit.BOARDS).toPromise();
  }

  public createBoard(board: Board): Promise<Board> {
    return this.restClientService.post<Board>(UrlConstant.Postit.BOARDS, board).toPromise();
  }

  public updateBoard(board: Board): Promise<Board> {
    return this.restClientService.patch<Board>(UrlConstant.Postit.BOARDS + '/' + board.id, board).toPromise();
  }

  public deleteBoard(boardId: number): Promise<void> {
    return this.restClientService.delete<void>(UrlConstant.Postit.BOARDS + '/' + boardId).toPromise();
  }

  // Notes

  public getNoteList(boardId: number): Promise<Array<PostitNote>> {
    return this.restClientService.get<Array<PostitNote>>(UrlConstant.Postit.NOTES, { boardId: boardId }).toPromise();
  }

  public getNote(noteId: number): Promise<PostitNote> {
    return this.restClientService.get<PostitNote>(UrlConstant.Postit.NOTES + '/' + noteId).toPromise();
  }

  public createNote(note: PostitNote): Promise<PostitNote> {
    return this.restClientService.post<PostitNote>(UrlConstant.Postit.NOTES, note).toPromise();
  }

  public updateNote(note: PostitNote): Promise<PostitNote> {
    return this.restClientService.patch<PostitNote>(UrlConstant.Postit.NOTES + '/' + note.id, note).toPromise();
  }

  public deleteNote(noteId: number): Promise<void> {
    return this.restClientService.delete<void>(UrlConstant.Postit.NOTES + '/' + noteId).toPromise();
  }

}
