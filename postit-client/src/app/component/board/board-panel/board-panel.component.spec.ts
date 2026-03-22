import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardPanelComponent } from './board-panel.component';
import { GlobalInfoService } from '@app/service/util/global-info.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { defaultNoteListMock, defaultNoteMock } from '@test/fixture/notes.fixture';
import { defaultBoardMock, defaultOtherBoardListMock } from '@test/fixture/boards.fixture';
import { BoardNoteComponent } from '@app/component/board/board-note/board-note.component';
import { Component, input } from '@angular/core';
import { Board } from '@app/model/postit/board';
import { PostitNote } from '@app/model/postit/postit-note';
import { By } from '@angular/platform-browser';
import { AlertType } from '@app/const/alert-type';

@Component({
  selector: 'app-board-note',
  standalone: true,
  template: '<div id="mock-board-note"></div>',
})
class BoardNoteStub {
  public note = input<PostitNote>({} as PostitNote);
  public otherBoardList = input<Board[]>([]);
}

describe('BoardPanelComponent', () => {
  let component: BoardPanelComponent;
  let fixture: ComponentFixture<BoardPanelComponent>;
  let httpMock: HttpTestingController;
  const globalInfoServiceMock = {
    showAlert: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardPanelComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: GlobalInfoService, useValue: globalInfoServiceMock },
      ],
    })
      .overrideComponent(BoardPanelComponent, {
        remove: { imports: [BoardNoteComponent] },
        add: { imports: [BoardNoteStub] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BoardPanelComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('board', defaultBoardMock());
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('noteList', defaultNoteListMock());
    fixture.componentRef.setInput('otherBoardList', defaultOtherBoardListMock());
    fixture.componentRef.setInput('parameterNoteMax', 20);
    fixture.detectChanges();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show notes and buttons', () => {
    const noteDebugList = fixture.debugElement.queryAll(By.directive(BoardNoteStub));
    expect(noteDebugList).toHaveLength(2);
    expect(noteDebugList[0].componentInstance.note()).toStrictEqual(defaultNoteListMock()[0]);
    expect(noteDebugList[0].componentInstance.otherBoardList()).toStrictEqual(defaultOtherBoardListMock());

    const cardButtons = fixture.nativeElement.querySelector('.cardButtons');
    expect(cardButtons.querySelector('mat-spinner')).toBeNull();
    expect(cardButtons.querySelector('button[data-testid="refreshBtn"]').title).toBe('Refresh board');
    expect(cardButtons.querySelector('button[data-testid="addBtn"]').disabled).toBeFalsy();
    expect(cardButtons.querySelector('button[data-testid="addBtn"]').textContent).toContain('Add a note');
  });

  it('should show notes also in draggable mode', () => {
    fixture.componentRef.setInput('noteDraggable', true);
    fixture.detectChanges();

    const noteDebugList = fixture.debugElement.queryAll(By.directive(BoardNoteStub));
    expect(noteDebugList).toHaveLength(2);
    expect(noteDebugList[0].componentInstance.note()).toStrictEqual(defaultNoteListMock()[0]);
    expect(noteDebugList[0].componentInstance.otherBoardList()).toStrictEqual(defaultOtherBoardListMock());
  });

  it('should show loader if loading', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const cardButtons = fixture.nativeElement.querySelector('.cardButtons');
    expect(cardButtons.querySelector('mat-spinner')).not.toBeNull();
    expect(cardButtons.querySelector('button[data-testid="refreshBtn"]')).toBeNull();
    expect(cardButtons.querySelector('button[data-testid="addBtn"]').disabled).toBeTruthy();
    expect(cardButtons.querySelector('button[data-testid="addBtn"]').textContent).toContain('Add a note');
  });

  it('should emit refresh board', () => {
    const askRefreshBoardSpy = vi.spyOn(component.askRefreshBoard, 'emit');

    const cardButtons = fixture.nativeElement.querySelector('.cardButtons');
    const refreshBtn = cardButtons.querySelector('button[data-testid="refreshBtn"]');
    refreshBtn.click();
    expect(askRefreshBoardSpy).toHaveBeenCalledWith(1);
  });

  it('should create new note', () => {
    const askRefreshBoardSpy = vi.spyOn(component.askRefreshBoard, 'emit');

    const cardButtons = fixture.nativeElement.querySelector('.cardButtons');
    const addBtn = cardButtons.querySelector('button[data-testid="addBtn"]');
    addBtn.click();

    const req = httpMock.expectOne('/api/postit/notes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toStrictEqual({
      boardId: 1,
      name: 'New note',
    });
    req.flush(defaultNoteMock());

    expect(globalInfoServiceMock.showAlert).toHaveBeenCalledWith(AlertType.SUCCESS, 'New note created');
    expect(askRefreshBoardSpy).toHaveBeenCalledWith(1);
  });
});
