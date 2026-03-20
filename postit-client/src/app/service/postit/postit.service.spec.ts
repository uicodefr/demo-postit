import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UrlConstant } from '@app/const/url-constant';
import { Board } from '@app/model/postit/board';
import { PostitService } from '@app/service/postit/postit.service';
import { provideHttpClient } from '@angular/common/http';

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

  it('getBoardList should call the correct url', () => {
    const boardList: Board[] = [];
    boardList.push({ id: 1, name: 'Test 1' }, { id: 2, name: 'Test 2' });

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
