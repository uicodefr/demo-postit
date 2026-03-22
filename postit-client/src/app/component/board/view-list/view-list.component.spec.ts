import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewListComponent } from './view-list.component';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { provideRouter } from '@angular/router';

describe('ViewListComponent', () => {
  let component: ViewListComponent;
  let fixture: ComponentFixture<ViewListComponent>;

  beforeEach(async () => {
    const mockBottomSheetRef = {
      dismiss: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ViewListComponent],
      providers: [
        provideRouter([]),
        { provide: MatBottomSheetRef, useValue: mockBottomSheetRef },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show view list', () => {
    expect(fixture.nativeElement.querySelector('[data-testid="tabsItem"] .title').textContent).toContain('Tabs');
    expect(fixture.nativeElement.querySelector('[data-testid="tabsItem"] .indication').textContent).toContain(
      'individually display with a tab for each board (default)',
    );

    expect(fixture.nativeElement.querySelector('[data-testid="panelsItem"] .title').textContent).toContain('Panels');
    expect(fixture.nativeElement.querySelector('[data-testid="panelsItem"] .indication').textContent).toContain(
      'each board in a panel which can be displayed or hidden',
    );

    expect(fixture.nativeElement.querySelector('[data-testid="tableItem"] .title').textContent).toContain('Table');
    expect(fixture.nativeElement.querySelector('[data-testid="tableItem"] .indication').textContent).toContain(
      'all boards in column (support drag and drop)',
    );
  });
});
