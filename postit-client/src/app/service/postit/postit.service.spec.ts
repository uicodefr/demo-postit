import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UrlConstant } from '@app/const/url-constant';
import { PostitService } from '@app/service/postit/postit.service';
import { provideHttpClient } from '@angular/common/http';
import { defaultBoardListMock } from '@test/fixture/boards.fixture';

let postitService: PostitService;
let httpMock: HttpTestingController;

describe('PostitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostitService, provideHttpClient(), provideHttpClientTesting()],
    });

    postitService = TestBed.inject(PostitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(postitService).toBeTruthy();
  });

  it('getBoardList should call the correct url', () => {
    const boardList = defaultBoardListMock();

    postitService.getBoardList().subscribe((result) => {
      expect(result).toBe(boardList);
    });

    const mockRequest = httpMock.expectOne(UrlConstant.Postit.BOARDS);
    expect(mockRequest.request.method).toEqual('GET');
    expect(mockRequest.request.responseType).toEqual('json');
    mockRequest.flush(boardList);
    httpMock.verify();
  });
});
