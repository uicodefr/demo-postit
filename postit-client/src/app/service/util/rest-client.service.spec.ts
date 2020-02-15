import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { RestClientService } from './rest-client.service';
import { GlobalInfoService } from './global-info.service';

let restClientService: RestClientService;
let httpClientSpy: jasmine.SpyObj<HttpClient>;
let globalInfoSpy: jasmine.SpyObj<GlobalInfoService>;

describe('RestClientService', () => {
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'patch', 'delete']);
    globalInfoSpy = jasmine.createSpyObj('GlobalInfoService', ['notifLoader']);

    TestBed.configureTestingModule({
      providers: [
        RestClientService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: GlobalInfoService, useValue: globalInfoSpy }
      ]
    });

    restClientService = TestBed.get(RestClientService);
  });

  it('get use httpClient and use notifLoader', done => {
    const url = 'testUrl';
    const paramData = { dataName: 'dataValue' };
    const resultGet = { result: 'ok' };

    httpClientSpy.get.and.returnValue(
      of(
        new HttpResponse<any>({ body: resultGet })
      )
    );

    restClientService
      .get<any>(url, paramData)
      .toPromise()
      .then(result => {
        expect(result).toEqual(resultGet);
        expect(httpClientSpy.get).toHaveBeenCalled();
        expect(globalInfoSpy.notifLoader).toHaveBeenCalledWith(true);
        expect(globalInfoSpy.notifLoader).toHaveBeenCalledWith(false);
        done();
      });
  });
});
