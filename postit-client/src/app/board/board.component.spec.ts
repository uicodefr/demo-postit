import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTabsModule, MatCardModule } from '@angular/material';

import { BoardComponent } from './board.component';
import { GlobalInfoService } from '../shared/service/utils/global-info.service';
import { PostitService } from '../shared/service/postit/postit.service';
import { TranslateService } from '../shared/service/utils/translate.service';
import { GlobalService } from '../shared/service/global/global.service';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async(() => {
    const globalInfoSpy = jasmine.createSpyObj('GlobalInfoService', ['showAlert']);

    const globalSpy = jasmine.createSpyObj('GlobalService', ['getParameterValue']);
    globalSpy.getParameterValue.and.returnValue(Promise.resolve(null));

    const postitSpy = jasmine.createSpyObj('PostitService', ['getBoardList', 'getNoteList', 'createNote']);
    postitSpy.getBoardList.and.returnValue(Promise.resolve([]));

    TestBed.configureTestingModule({
      declarations: [BoardComponent],
      providers: [
        { provide: GlobalInfoService, useValue: globalInfoSpy },
        TranslateService,
        { provide: GlobalService, useValue: globalSpy },
        { provide: PostitService, useValue: postitSpy }
      ],
      imports: [MatTabsModule, MatCardModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
