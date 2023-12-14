import { Directive, Input } from '@angular/core';
import { BnLayoutElementBaseDirective } from '../shared/bn-layout-element-base.directive';
import { BnLogSource } from '@binom/sdk-core/logger';
import { BnGridWrapperEvent } from '../interfaces/bn-grid-wrapper-event';

@Directive({
  selector: '[bnLayoutContent]',
  standalone: true
})
export class BnLayoutContentDirective extends BnLayoutElementBaseDirective {

  override elTag: string = 'content';
  override logSource: BnLogSource = {
    module: 'bnLayout',
    source: 'ContentDirective'
  }


  ngOnInit():void{
    this.onInit();
  }

  updateView(){
    if(this.current){
     
      this.renderUtil.toggleHeight(this.gridSvc.checkCalcHeights(this.current), this.current.heights.content+'px','100%');
      if(this.gridSvc.checkCalcHeights(this.current))  {
        this.renderUtil.setStyle('overflow','auto');
      } else {
        this.renderUtil.setStyle('overflow','unset');
      }
      
    }
  }

  protected override handleLayoutEvent(eventData:BnGridWrapperEvent):void {
    this.updateView();
    if(eventData.wrapper === this.belongsToWrapper || eventData.wrapper === 'all'){
     
    }

  }
}