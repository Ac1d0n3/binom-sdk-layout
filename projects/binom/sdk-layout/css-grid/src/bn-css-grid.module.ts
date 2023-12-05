import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BnLayoutAppWrapperDirective } from './wrapper/bn-layout-app-wrapper.directive';
import { BnLayoutWrapperDirective } from './wrapper/bn-layout-wrapper.directive';
import { BnLayoutContentDirective } from './content/bn-layout-content.directive';
import { BnLayoutPreContentDirective } from './content/bn-layout-pre-content.directive';
import { BnLayoutFooterDirective } from './footer/bn-layout-footer.directive';
import { BnLayoutSidebarDirective } from './sidebar/bn-layout-sidebar.directive';
import { BnLayoutHeaderDirective } from './header/bn-layout-header.directive';
import { BnLayoutPreHeaderDirective } from './header/bn-layout-pre-header.directive';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BnLayoutAppWrapperDirective,
    BnLayoutWrapperDirective,
    BnLayoutContentDirective,
    BnLayoutPreContentDirective,
    BnLayoutFooterDirective,
    BnLayoutSidebarDirective,
    BnLayoutHeaderDirective,
    BnLayoutPreHeaderDirective
  ],
  exports:[
    BnLayoutAppWrapperDirective,
    BnLayoutWrapperDirective,
    BnLayoutContentDirective,
    BnLayoutPreContentDirective,
    BnLayoutFooterDirective,
    BnLayoutSidebarDirective,
    BnLayoutHeaderDirective,
    BnLayoutPreHeaderDirective
  ]
})
export class BnCssGridModule { }
