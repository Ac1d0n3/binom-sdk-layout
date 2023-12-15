import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[bnSplitContentItem]',
  standalone: true
})
export class BnSplitContentItemDirective {

  constructor(public template: TemplateRef<any>) {}
}
