import { AfterViewInit, ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar'
import { BnTranslateSwitchMenuComponent } from '@binom/sdk-core/translate';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule} from '@angular/material/expansion';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { BnAnimateOnScrollComponent, BnAosViewPortDirective } from '@binom/sdk-animation/aos';
import { BnLayoutAppWrapperDirective } from '../../../binom/sdk-layout/css-grid';
import { BnCssGridModule } from '@binom/sdk-layout/css-grid';
import { BnLoggerService } from '@binom/sdk-core/logger';
import { BnLayoutSwitchMenuComponent } from '@binom/sdk-layout/layout-switch';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterModule, MatToolbarModule, BnAnimateOnScrollComponent,BnAosViewPortDirective,
    BnTranslateSwitchMenuComponent, TranslateModule, MatSidenavModule, MatButtonModule, MatExpansionModule, BnLayoutSwitchMenuComponent,
    CdkScrollableModule, BnCssGridModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test';
  constructor(private translate:TranslateService){
    this.translate.addLangs(['en-US', 'de-DE']);
    this.translate.setDefaultLang( 'en-US' );
    this.data.sort((a:any, b:any) => a.title.localeCompare(b.title));
    this.data.forEach((item:any) => {
      item.data.sort();
    });
    this.logger.logLevel = -1;

  }


  private logger = inject(BnLoggerService)

  

  data = [

    {
      title: 'animation',
      data: ['effects', 'in', 'out']
    },
    {
      title: 'aos',
      data: ['svc', 'directive']
    },
  
  ]

  preheader:boolean = true;
  sidebarleft:boolean = false;
  sidebarright:boolean = false;
  toggleIconSidebar:boolean = false;
  precontent:boolean = true;
  footer:boolean = true;

  
}
