import { TestBed } from '@angular/core/testing';

import { BnLayoutGridService } from './bn-layout-grid.service';

describe('BnLayoutGridService', () => {
  let service: BnLayoutGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BnLayoutGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
