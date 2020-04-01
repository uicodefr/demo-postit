import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewListComponent } from './view-list.component';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AppMaterialModule } from 'src/app/app-material.module';

describe('ViewListComponent', () => {
  let component: ViewListComponent;
  let fixture: ComponentFixture<ViewListComponent>;

  beforeEach(async(() => {
    const mockBottomSheetRef = {
      dismiss: jasmine.createSpy('dismiss')
    };

    TestBed.configureTestingModule({
      imports: [AppMaterialModule],
      declarations: [ViewListComponent],
      providers: [{ provide: MatBottomSheetRef, useValue: mockBottomSheetRef }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
