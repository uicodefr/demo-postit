import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachedFileDialogComponent } from './attached-file-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GlobalInfoService } from '@app/service/util/global-info.service';
import { AlertType } from '@app/const/alert-type';
import { defaultAttachedFileMock } from '@test/fixture/notes.fixture';

describe('AttachedFileDialogComponent', () => {
  let component: AttachedFileDialogComponent;
  let fixture: ComponentFixture<AttachedFileDialogComponent>;
  let httpMock: HttpTestingController;
  const mockDialogRef = {
    close: vi.fn(),
  };
  const globalInfoServiceMock = {
    showAlert: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachedFileDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: defaultAttachedFileMock(),
        },
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: GlobalInfoService,
          useValue: globalInfoServiceMock,
        },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachedFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show attachedFile propose to download', () => {
    expect(fixture.nativeElement.querySelector('.content strong').textContent).toBe('filenameTest.jpg');
    expect(fixture.nativeElement.querySelector('.content .descriptionFile').textContent).toContain(
      '2050 ko (image/jpeg)',
    );
    const downloadBtn = fixture.nativeElement.querySelector('button[data-testid="downloadBtn"]');
    expect(downloadBtn.textContent).toContain('DOWNLOAD');
    expect(downloadBtn.title).toContain('Download file');
  });

  it('should delete the file if delete button if clicked', async () => {
    const deleteBtn = fixture.nativeElement.querySelector('button.deleteBtn');
    expect(deleteBtn.title).toContain('Delete the attachment');
    deleteBtn.click();

    const req = httpMock.expectOne('/api/postit/attached-files/11');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    await fixture.whenStable();
    fixture.detectChanges();
    expect(globalInfoServiceMock.showAlert).toHaveBeenCalledWith(AlertType.SUCCESS, 'Attachment deleted');
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
