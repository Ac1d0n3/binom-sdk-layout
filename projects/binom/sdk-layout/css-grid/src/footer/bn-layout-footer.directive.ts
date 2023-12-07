import { Directive, Input } from '@angular/core';
import { BnLayoutElementBaseDirective } from '../shared/bn-layout-element-base.directive';
import { BnLogSource } from '@binom/sdk-core/logger';
import { BooleanInput, NumberInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';

@Directive({
  selector: '[bnLayoutFooter]',
  standalone: true
})
export class BnLayoutFooterDirective extends BnLayoutElementBaseDirective {

  override elTag: string = 'footer';
  override logSource: BnLogSource = { module: 'bnLayout', source: 'FooterDirective' }

  private _fullWidth: boolean = false;
  get fullWidth(): boolean { return this._fullWidth;}
  @Input() set fullWidth(val: BooleanInput) { this._fullWidth = coerceBooleanProperty(val); }

  @Input() fullWidthContent:  'always' | 'none' | 'fullscreen' = 'always';

  private _height:number = 200;
  get height():number{ return this._height; }
  @Input() set height(val:NumberInput){ this._height= coerceNumberProperty(val); }

  ngOnInit():void{
    this.onInit();
    this.__initFooter();
  }


  private __initFooter(){
    if(!this.current) return;
    this.configSvc.setElementHeight(this.current, this.elTag, this.height);
    this.renderUtil.setHeight(this.height);
    this.configSvc.setFooterDefaults(this.current, this.fullWidth, this.fullWidthContent);
  }
  
}