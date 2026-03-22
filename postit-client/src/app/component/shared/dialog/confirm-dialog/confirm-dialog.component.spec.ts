import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  const mockDialogRef = {
    close: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Title Test',
            message: 'Message Test',
            confirm: 'Confirm Test',
            cancel: 'Cancel Test',
          } as ConfirmDialogData,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show dialog', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Title Test');
    expect(fixture.nativeElement.querySelector('mat-dialog-content').textContent).toContain('Message Test');

    expect(fixture.nativeElement.querySelector('button[data-testid="cancelBtn"]').textContent).toContain('Cancel Test');
    expect(fixture.nativeElement.querySelector('button[data-testid="confirmBtn"]').textContent).toContain(
      'Confirm Test',
    );
  });

  it('return false for cancel', () => {
    const cancelBtn = fixture.nativeElement.querySelector('button[data-testid="cancelBtn"]');
    cancelBtn.click();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('return true for confirm', () => {
    const confirmBtn = fixture.nativeElement.querySelector('button[data-testid="confirmBtn"]');
    confirmBtn.click();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });
});
