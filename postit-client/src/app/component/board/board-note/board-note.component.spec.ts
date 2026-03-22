import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';
import { BoardNoteComponent } from './board-note.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { defaultNoteMock, noteWithAttachedFileMock } from '@test/fixture/notes.fixture';
import { AttachedFileDialogComponent } from '@app/component/board/attached-file-dialog/attached-file-dialog.component';
import { NEVER, of } from 'rxjs';
import { GlobalInfoService } from '@app/service/util/global-info.service';
import { AlertType } from '@app/const/alert-type';
import { EditNoteDialogComponent } from '@app/component/board/edit-note-dialog/edit-note-dialog.component';
import { ColorizeNoteDialogComponent } from '@app/component/board/colorize-note-dialog/colorize-note-dialog.component';
import { ConfirmDialogComponent } from '@app/component/shared/dialog/confirm-dialog/confirm-dialog.component';
import { defaultOtherBoardListMock } from '@test/fixture/boards.fixture';

describe('BoardNoteComponent', () => {
  let component: BoardNoteComponent;
  let fixture: ComponentFixture<BoardNoteComponent>;
  let httpMock: HttpTestingController;
  const matDialogMock = {
    open: vi.fn().mockImplementation(() => {
      return {
        afterClosed: vi.fn().mockReturnValue(NEVER),
      };
    }),
  };
  const globalInfoServiceMock = {
    showAlert: vi.fn(),
  };

  function mockDialogCloseWithData(data: unknown) {
    // Remock to return note on afterClosed
    matDialogMock.open.mockImplementation(() => {
      return {
        afterClosed: vi.fn().mockReturnValue(of(data)),
      };
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardNoteComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialog, useValue: matDialogMock },
        {
          provide: GlobalInfoService,
          useValue: globalInfoServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardNoteComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('note', defaultNoteMock());
    fixture.componentRef.setInput('otherBoardList', defaultOtherBoardListMock());
    fixture.detectChanges();

    httpMock = TestBed.inject(HttpTestingController);
    // mock call made on ngInit
    const reqInit = httpMock.expectOne('/api/global/parameters/upload.size.max');
    reqInit.flush('200000');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the note', () => {
    expect(fixture.nativeElement.querySelector('mat-card-title').textContent).toContain('Note Title');
    expect(fixture.nativeElement.querySelector('mat-card-content p.text').textContent).toContain('Note Text Content');

    expect(fixture.nativeElement.querySelector('button[data-testid="moveUpBtn"]').title).toBe('Move up');
    expect(fixture.nativeElement.querySelector('button[data-testid="moveDownBtn"]').title).toBe('Move down');
    expect(fixture.nativeElement.querySelector('button[data-testid="moveBoardBtn"]').title).toBe(
      'Move to another board',
    );
    expect(fixture.nativeElement.querySelector('button.editBtn').textContent).toContain('EDIT');
    expect(fixture.nativeElement.querySelector('button[data-testid="changeColorBtn"]').title).toBe('Change Color');
    expect(fixture.nativeElement.querySelector('button.downloadBtn')).toBeNull();
    expect(fixture.nativeElement.querySelector('button[data-testid="uploadFileBtn"]').title).toBe(
      'Upload an attachment',
    );
    expect(fixture.nativeElement.querySelector('button[data-testid="deleteBtn"]').title).toBe('Delete');
  });

  it('should show the note with an attachedFile', () => {
    fixture.componentRef.setInput('note', noteWithAttachedFileMock());
    fixture.detectChanges();

    const downloadBtn = fixture.nativeElement.querySelector('button.downloadBtn');
    expect(downloadBtn.title).toBe('View the attachment');
    expect(fixture.nativeElement.querySelector('button[data-testid="uploadFileBtn"]')).toBeNull();

    downloadBtn.click();
    expect(matDialogMock.open).toHaveBeenCalledWith(AttachedFileDialogComponent, expect.anything());
  });

  it('should moveUp or moveDown the note', () => {
    const moveUpBtn = fixture.nativeElement.querySelector('button[data-testid="moveUpBtn"]');
    const moveDownBtn = fixture.nativeElement.querySelector('button[data-testid="moveDownBtn"]');
    const orderNoteSpy = vi.spyOn(component.orderNote, 'emit');

    // MoveUp
    moveUpBtn.click();
    let req = httpMock.expectOne('/api/postit/notes/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toStrictEqual({
      id: 1,
      orderNum: 9,
    });
    let notePatchedMock = { ...component.note(), orderNum: 9 };
    req.flush(notePatchedMock);
    expect(orderNoteSpy).toHaveBeenCalledWith(notePatchedMock);

    // MoveDown
    moveDownBtn.click();
    req = httpMock.expectOne('/api/postit/notes/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toStrictEqual({
      id: 1,
      orderNum: 10,
    });
    notePatchedMock = { ...component.note(), orderNum: 10 };
    req.flush(notePatchedMock);
    expect(orderNoteSpy).toHaveBeenCalledWith(notePatchedMock);
  });

  it('should move to another board', async () => {
    const moveBoardBtn = fixture.nativeElement.querySelector('button[data-testid="moveBoardBtn"]');
    moveBoardBtn.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const moveBoardNameBtnList = document.querySelectorAll('button[data-testid="moveBoardNameBtn"]');
    expect(moveBoardNameBtnList).toHaveLength(2);
    expect(moveBoardNameBtnList[0].textContent).toContain('Other Board 2');
    expect(moveBoardNameBtnList[1].textContent).toContain('Other Board 3');

    const moveNoteSpy = vi.spyOn(component.moveNote, 'emit');

    (moveBoardNameBtnList[1] as HTMLElement).click();
    const req = httpMock.expectOne('/api/postit/notes/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toStrictEqual({
      id: 1,
      boardId: 3,
    });
    const notePatchedMock = { ...component.note(), boardId: 3 };
    req.flush(notePatchedMock);
    expect(moveNoteSpy).toHaveBeenCalledWith(notePatchedMock);
    expect(globalInfoServiceMock.showAlert).toHaveBeenCalledWith(AlertType.SUCCESS, 'Note moved');
  });

  it('should open edit dialog', () => {
    const editBtn = fixture.nativeElement.querySelector('button.editBtn');

    mockDialogCloseWithData(component.note());
    const changeNoteSpy = vi.spyOn(component.changeNote, 'emit');

    editBtn.click();
    const req = httpMock.expectOne('/api/postit/notes/1');
    expect(req.request.method).toBe('GET');
    req.flush(component.note());

    expect(matDialogMock.open).toHaveBeenCalledWith(EditNoteDialogComponent, expect.anything());
    expect(changeNoteSpy).toHaveBeenCalledWith(component.note());
    expect(globalInfoServiceMock.showAlert).toHaveBeenCalledWith(AlertType.SUCCESS, 'Note updated');
  });

  it('should open colorize dialog', () => {
    const changeColorBtn = fixture.nativeElement.querySelector('button[data-testid="changeColorBtn"]');

    mockDialogCloseWithData(component.note());
    const changeNoteSpy = vi.spyOn(component.changeNote, 'emit');

    changeColorBtn.click();

    expect(matDialogMock.open).toHaveBeenCalledWith(ColorizeNoteDialogComponent, expect.anything());
    expect(changeNoteSpy).toHaveBeenCalledWith(component.note());
  });

  it('should open delete dialog and delete after confirmation', () => {
    const deleteBtn = fixture.nativeElement.querySelector('button[data-testid="deleteBtn"]');

    mockDialogCloseWithData(true);
    const deleteNoteSpy = vi.spyOn(component.deleteNote, 'emit');

    deleteBtn.click();

    const req = httpMock.expectOne('/api/postit/notes/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});

    expect(matDialogMock.open).toHaveBeenCalledWith(ConfirmDialogComponent, expect.anything());
    expect(deleteNoteSpy).toHaveBeenCalledWith(component.note());
    expect(globalInfoServiceMock.showAlert).toHaveBeenCalledWith(AlertType.SUCCESS, 'Note deleted');
  });
});
