import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


import { BnAnimateOnScrollComponent, BnAosViewPortDirective } from '@binom/sdk-animation/aos';
import { BnAnimationService } from '@binom/sdk-animation/animation-timeout';
import { BnCssGridModule } from '@binom/sdk-layout/css-grid';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-nested-nested',
  standalone: true,
  imports: [CommonModule,BnAnimateOnScrollComponent,BnAosViewPortDirective, BnCssGridModule, MatToolbarModule, MatButtonModule],
  templateUrl: './nested-nested.component.html',
  styleUrl: './nested-nested.component.scss'
})
export class NestedNestedComponent {
  preheader:boolean = false;
  sidebarleft:boolean = true;
  sidebarright:boolean =false;
  precontent:boolean = false;
  footer:boolean = false;
}
