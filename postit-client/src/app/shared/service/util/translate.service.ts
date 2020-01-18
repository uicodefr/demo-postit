import { Injectable } from '@angular/core';

import { translation } from '../../../../environments/translation';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  public constructor() { }

  public get(value: string): string {
    if (!translation[value]) {
      console.warn('Translation missing for : ' + value);
    }
    return translation[value];
  }

}
