import { Directive,TemplateRef,ViewContainerRef, Input, inject } from '@angular/core';
import { BnLayoutService } from '@binom/sdk-layout/core';

import { debounceTime, Subscription } from 'rxjs';
@Directive({
  selector: '[bnShowOnDevice]',
  standalone: true
})
export class BnShowOnDeviceDirective {
  sub$!: Subscription;
  condition: string = '';

  private templateRef = inject(TemplateRef<any>)
  private layoutSvc = inject(BnLayoutService)
  private viewContainer = inject(ViewContainerRef) 
  constructor() {}
  
  ngOnInit() {
    let conditions = this.condition.split(' ')
    this.sub$ = this.layoutSvc.layoutInfo$.pipe(debounceTime(100)).subscribe(
      (data:any) => {
        this.viewContainer.clear();
        for (let i=0; i<conditions.length; i++){
          if( conditions[i]=== data.device+'-'+data.window.orientation ||
              conditions[i]=== data.device+'*') {
            this.viewContainer.createEmbeddedView(this.templateRef);
          }
        }
      }
    );
  }
  ngOnDestroy() {
    this.sub$.unsubscribe()
  }
  @Input() set bnShowOnDeviceSize(condition: string) {
    this.condition = condition;
  }
}