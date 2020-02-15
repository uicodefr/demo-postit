import { TestBed } from '@angular/core/testing';

import { LikeService } from './like.service';
import { RestClientService } from '../util/rest-client.service';

let likeService: LikeService;
let restClientSpy: jasmine.SpyObj<RestClientService>;

describe('LikeService', () => {
  beforeEach(() => {
    restClientSpy = jasmine.createSpyObj('RestClientService', ['get', 'post', 'put', 'patch', 'delete']);

    TestBed.configureTestingModule({
      providers: [LikeService, { provide: RestClientService, useValue: restClientSpy }]
    });

    likeService = TestBed.get(LikeService);
  });

  it('should be created', () => {
    const service: LikeService = TestBed.get(LikeService);
    expect(service).toBeTruthy();
  });
});
