import { CanActivateFn } from '@angular/router';

export const bnNotOnPhoneGuard: CanActivateFn = (route, state) => {
  return true;
};
