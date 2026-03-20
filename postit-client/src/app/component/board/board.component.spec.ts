import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { BoardComponent } from './board.component';
import { of } from 'rxjs';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UrlConstant } from '@app/const/url-constant';
import { Board } from '@app/model/postit/board';
import { GlobalConstant } from '@app/const/global-constant';
import { BoardPanelComponent } from './board-panel/board-panel.component';
import { BoardNoteComponent } from './board-note/board-note.component';
import { PostitNote } from '@app/model/postit/postit-note';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let httpMock: HttpTestingController;

  const mockStandardRequest = () => {
    const mockRequestParamMax = httpMock.expectOne(
      UrlConstant.Global.PARAMETERS + '/' + GlobalConstant.Parameter.NOTE_MAX,
    );
    mockRequestParamMax.flush('10');

    const mockRequestBoards = httpMock.expectOne(UrlConstant.Postit.BOARDS);
    mockRequestBoards.flush([
      { id: 1, name: 'Board1' },
      { id: 2, name: 'Board2' },
      { id: 3, name: 'Board3' },
    ] as Board[]);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardComponent, BoardPanelComponent, BoardNoteComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([{ path: 'board', component: BoardComponent }]),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ view: 'panel' }),
          },
        },
      ],
      schemas: [],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
    expect(component).toBeTruthy();
  });

  it('should init in tabs view', async () => {
    const activatedRouteMock = TestBed.inject(ActivatedRoute);
    activatedRouteMock.params = of({ id: '2' });
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();

    mockStandardRequest();

    await fixture.whenStable();
    expect(component.parameterNoteMax()).toEqual(10);
    const noteRequestNote = httpMock.expectOne(UrlConstant.Postit.NOTES + '?boardId=2');
    noteRequestNote.flush([{ id: 1, name: 'name', text: 'text', boardId: 2 }] as PostitNote[]);
    httpMock.verify();

    await fixture.whenStable();
    expect(component.activeView()).toBeFalsy();
    expect(component.selectedIndex()).toEqual(1);
    expect(component.noteListMap().size).toEqual(1);
    expect(fixture.nativeElement.querySelector('.mat-mdc-tab-group')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.mat-accordion')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.flexTable')).toBeFalsy();
  });

  it('should init in panel view', async () => {
    const activatedRouteMock = TestBed.inject(ActivatedRoute);
    activatedRouteMock.params = of({ view: 'panels' });
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();

    mockStandardRequest();

    await fixture.whenStable();
    httpMock.verify();
    expect(component.activeView()).toEqual('panels');
    expect(component.noteListMap().size).toEqual(0);
    expect(fixture.nativeElement.querySelector('.mat-tab-group')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.mat-accordion')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.flexTable')).toBeFalsy();
  });

  it('should init in table view', async () => {
    const activatedRouteMock = TestBed.inject(ActivatedRoute);
    activatedRouteMock.params = of({ view: 'table' });
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();

    mockStandardRequest();

    await fixture.whenStable();
    const noteRequestNote1 = httpMock.expectOne(UrlConstant.Postit.NOTES + '?boardId=1');
    noteRequestNote1.flush([{ id: 1, name: 'name', text: 'text', boardId: 1 }] as PostitNote[]);
    const noteRequestNote2 = httpMock.expectOne(UrlConstant.Postit.NOTES + '?boardId=2');
    noteRequestNote2.flush([{ id: 2, name: 'name', text: 'text', boardId: 2 }] as PostitNote[]);
    const noteRequestNote3 = httpMock.expectOne(UrlConstant.Postit.NOTES + '?boardId=3');
    noteRequestNote3.flush([{ id: 3, name: 'name', text: 'text', boardId: 3 }] as PostitNote[]);
    httpMock.verify();

    await fixture.whenStable();
    expect(component.activeView()).toEqual('table');
    expect(component.noteListMap().size).toEqual(3);
    expect(fixture.nativeElement.querySelector('.mat-tab-group')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.mat-accordion')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.flexTable')).toBeTruthy();
  });
});
