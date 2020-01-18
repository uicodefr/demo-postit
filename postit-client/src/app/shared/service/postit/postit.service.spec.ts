import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PostitService } from './postit.service';
import { RestClientService } from '../util/rest-client.service';
import { Board } from '../../model/postit/board';

let postitService: PostitService;
let restClientSpy: jasmine.SpyObj<RestClientService>;

describe('PostitService', () => {

  beforeEach(() => {
    restClientSpy = jasmine.createSpyObj('RestClientService', ['get', 'post', 'put', 'patch', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        PostitService,
        { provide: RestClientService, useValue: restClientSpy }
      ]
    });

    postitService = TestBed.get(PostitService);
  });

  // Nice Tautological Tests
  it('getBoardList should return value from a spy', (done) => {
    const boardList: Array<Board> = [];
    boardList.push({ id: 1, name: 'Test 1' });
    boardList.push({ id: 2, name: 'Test 2' });

    restClientSpy.get.and.returnValue(of(boardList));

    postitService.getBoardList().then(result => {
      expect(restClientSpy.get).toHaveBeenCalled();
      expect(result).toBe(boardList);
      done();
    });
  });

});
