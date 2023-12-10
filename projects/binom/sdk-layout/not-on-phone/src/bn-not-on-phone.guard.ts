import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { BnLayoutService } from '@binom/sdk-layout/core';


export function bnNotOnPhoneGuard(
  redirectRoute: string
): CanActivateFn {
  return () => {
    const layoutSvc: BnLayoutService = inject(BnLayoutService);
    const router: Router = inject(Router);
    return layoutSvc.layoutInfo.device !== 'phone' || router.createUrlTree([redirectRoute]);
  };
}