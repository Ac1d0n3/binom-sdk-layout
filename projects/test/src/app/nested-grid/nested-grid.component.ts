import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { BnAnimateOnScrollComponent, BnAosViewPortDirective } from '@binom/sdk-animation/aos';
import { BnAnimationService } from '@binom/sdk-animation/animation-timeout';
import { BnCssGridModule } from '@binom/sdk-layout/css-grid';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NestedNestedComponent } from '../nested-nested/nested-nested.component';

@Component({
  selector: 'app-nested-grid',
  standalone: true,
  imports: [CommonModule,BnAnimateOnScrollComponent,BnAosViewPortDirective, BnCssGridModule, MatToolbarModule, MatButtonModule, NestedNestedComponent],
  templateUrl: './nested-grid.component.html',
  styleUrl: './nested-grid.component.scss'
})
export class NestedGridComponent {
  preheader:boolean = true;
  sidebarleft:boolean = true;
  sidebarright:boolean = true;
  precontent:boolean = true;
  footer:boolean = true;
}
