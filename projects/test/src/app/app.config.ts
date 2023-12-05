import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BnLayoutService } from '@binom/sdk-layout/core';
import { BnLayoutGridService } from '@binom/sdk-layout/css-grid';
import { BnLoggerService } from '@binom/sdk-core/logger';

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(TranslateModule.forRoot({
        defaultLanguage: 'en-US',
        loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient],
        },
    })), provideAnimations(), BnLayoutService, BnLayoutGridService, BnLoggerService]
};



