import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { bnLayoutNotOnPhoneGuard } from './bn-layout-not-on-phone.guard';

describe('bnLayoutNotOnPhoneGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => bnLayoutNotOnPhoneGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
