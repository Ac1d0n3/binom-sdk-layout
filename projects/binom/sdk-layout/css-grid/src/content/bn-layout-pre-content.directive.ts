import { Directive, Input } from '@angular/core';
import { BnLayoutElementBaseDirective } from '../shared/bn-layout-element-base.directive';
import { BnLogSource } from '@binom/sdk-core/logger';

@Directive({
  selector: '[bnLayoutPreContent]',
  standalone: true
})
export class BnLayoutPreContentDirective extends BnLayoutElementBaseDirective {

  override elTag: string = 'precontent';
  override logSource: BnLogSource = { module: 'bnLayout', source: 'PrecontentDirective' };

  ngOnInit():void{
    this.onInit();

  }

  private __initPreContent(){
    if(!this.current) return;
    
  }
  
}