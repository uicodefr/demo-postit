import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';

import { SettingsComponent } from './settings.component';
import { TranslateService } from '../shared/service/utils/translate.service';
import { PostitService } from '../shared/service/postit/postit.service';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    const postitSpy = jasmine.createSpyObj('PostitService', ['getBoardList']);
    postitSpy.getBoardList.and.returnValue(Promise.resolve([]));

    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [
        MatDialog,
        { provide: PostitService, useValue: postitSpy },
        TranslateService
      ],
      imports: [FormsModule, MatDialogModule, MatInputModule, MatExpansionModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
