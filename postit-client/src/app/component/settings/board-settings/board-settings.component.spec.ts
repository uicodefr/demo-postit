import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { BoardSettingsComponent } from './board-settings.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { defaultBoardListMock, newBoardMock } from '@test/fixture/boards.fixture';
import { GlobalInfoService } from '@app/service/util/global-info.service';
import { NEVER, of } from 'rxjs';
import { AlertType } from '@app/const/alert-type';

describe('BoardSettingsComponent', () => {
  let component: BoardSettingsComponent;
  let fixture: ComponentFixture<BoardSettingsComponent>;
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
      imports: [BoardSettingsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialog, useValue: matDialogMock },
        { provide: GlobalInfoService, useValue: globalInfoServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock = TestBed.inject(HttpTestingController);
    const req = httpMock.expectOne('/api/postit/boards');
    expect(req.request.method).toBe('GET');
    req.flush(defaultBoardListMock());
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show board list', () => {
    const tableLineList = fixture.nativeElement.querySelectorAll('table tr');
    expect(tableLineList).toHaveLength(4);

    const headerList = tableLineList[0].querySelectorAll('th');
    expect(headerList[0].textContent).toContain('Id');
    expect(headerList[1].textContent).toContain('Name');
    expect(headerList[2].textContent).toContain('Order');
    expect(headerList[3].textContent).toContain('Actions');

    const board2RowList = tableLineList[2].querySelectorAll('td');
    expect(board2RowList[0].textContent).toContain('2');
    expect(board2RowList[1].querySelector('input').value).toContain('Board 2');
    expect(board2RowList[2].querySelector('input').value).toContain('200');

    const saveBtn = board2RowList[3].querySelector('button[data-testid="saveBtn"]');
    expect(saveBtn.textContent).toContain('Save');
    const deleteBtn = board2RowList[3].querySelector('button[data-testid="deleteBtn"]');
    expect(deleteBtn.textContent).toContain('Delete');

    const createBtn = fixture.nativeElement.querySelector('button[data-testid="createBtn"]');
    expect(createBtn.textContent).toContain('Create board');
  });

  it('should save board', () => {
    const tableLineList = fixture.nativeElement.querySelectorAll('table tr');
    const board2RowList = tableLineList[2].querySelectorAll('td');
    const nameBoardInput = board2RowList[1].querySelector('input');
    const orderBoardInput = board2RowList[2].querySelector('input');

    nameBoardInput.value = 'Board 2 Changed';
    nameBoardInput.dispatchEvent(new Event('input'));
    orderBoardInput.value = 201;
    orderBoardInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const saveBtn = board2RowList[3].querySelector('button[data-testid="saveBtn"]');
    saveBtn.click();

    let req = httpMock.expectOne('/api/postit/boards/2');
    expect(req.request.method).toBe('PATCH');
    const boardChanged = {
      id: 2,
      name: 'Board 2 Changed',
      orderNum: 201,
    };
    expect(req.request.body).toStrictEqual(boardChanged);
    req.flush(boardChanged);

    req = httpMock.expectOne('/api/postit/boards');
    expect(req.request.method).toBe('GET');
    expect(globalInfoServiceMock.showAlert).toHaveBeenCalledWith(AlertType.SUCCESS, 'Board updated');
  });

  it('should delete board', () => {
    const tableLineList = fixture.nativeElement.querySelectorAll('table tr');
    const board2RowList = tableLineList[2].querySelectorAll('td');
    const deleteBtn = board2RowList[3].querySelector('button[data-testid="deleteBtn"]');

    mockDialogCloseWithData(true);
    deleteBtn.click();
    let req = httpMock.expectOne('/api/postit/boards/2');
    expect(req.request.method).toBe('DELETE');
    req.flush({});

    req = httpMock.expectOne('/api/postit/boards');
    expect(req.request.method).toBe('GET');
    expect(globalInfoServiceMock.showAlert).toHaveBeenCalledWith(AlertType.SUCCESS, 'Board deleted');
  });

  it('should create board', () => {
    const createBtn = fixture.nativeElement.querySelector('button[data-testid="createBtn"]');
    createBtn.click();

    let req = httpMock.expectOne('/api/postit/boards');
    expect(req.request.method).toBe('POST');
    req.flush(newBoardMock(4));

    req = httpMock.expectOne('/api/postit/boards');
    expect(req.request.method).toBe('GET');
  });
});
