import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BnAnimateOnScrollComponent, BnAosViewPortDirective } from '@binom/sdk-animation/aos';
import { BnAnimationService } from '@binom/sdk-animation/animation-timeout';
import { BnCssGridModule } from '@binom/sdk-layout/css-grid';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,BnAnimateOnScrollComponent,BnAosViewPortDirective, BnCssGridModule, MatToolbarModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
