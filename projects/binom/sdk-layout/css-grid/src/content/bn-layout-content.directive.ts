import { Directive, Input } from '@angular/core';
import { BnLayoutElementBaseDirective } from '../shared/bn-layout-element-base.directive';
import { BnLogSource } from '@binom/sdk-core/logger';

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

  private __initContent(){
    if(!this.current) return;
    
  }
  
}