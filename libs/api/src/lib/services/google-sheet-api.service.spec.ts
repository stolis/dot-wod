import { TestBed } from '@angular/core/testing';

import { GoogleSheetApiService } from './google-sheet-api.service';

describe('GoogleSheetApiService', () => {
  let service: GoogleSheetApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleSheetApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
