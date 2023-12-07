import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BnAnimateOnScrollComponent, BnAosViewPortDirective } from '@binom/sdk-animation/aos';
import { BnAnimationService } from '@binom/sdk-animation/animation-timeout';
import { BnCssGridModule } from '@binom/sdk-layout/css-grid';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { BnGridBlockDirective } from '@binom/sdk-layout/grid-block';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,BnAnimateOnScrollComponent,BnAosViewPortDirective, BnCssGridModule, MatToolbarModule, MatButtonModule,BnGridBlockDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  //encapsulation:ViewEncapsulation.None,
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

}
