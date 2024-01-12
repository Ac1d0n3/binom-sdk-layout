import { Directive, Input } from '@angular/core';
import { BnLogSource } from '@binom/sdk-core/logger';
import { BooleanInput, NumberInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { BnLayoutElementAnimateBaseDirective } from '../shared/bn-layout-element-animate-base.directive';
import { BnGridWrapperEvent } from '../interfaces/bn-grid-wrapper-event';

@Directive({
  selector: '[bnLayoutFooter]',
  standalone: true
})
export class BnLayoutFooterDirective extends BnLayoutElementAnimateBaseDirective {

  override elTag: string = 'footer';
  override logSource: BnLogSource = { module: 'bnLayout', source: 'FooterDirective' }

  private _height:number = 200;
  get height():number{ return this._height; }
  @Input() set height(val:NumberInput){ this._height= coerceNumberProperty(val); }

  ngOnInit():void{
    this.onInit();
    this.__initFooter();
  }

  protected override afterViewInit(): void {
    this.__renderView();
  }

  private __initFooter(){
    if(!this.current) return;
    this.configSvc.setElementHeight(this.current, this.elTag, this.height);
    this.renderUtil.setHeight(this.height);
    this.configSvc.setFooterDefaults(this.current, this.fullWidth, this.fullWidthContent);
    if(this.fullWidth)this.renderUtil.setStyle('z-index','500');
  }

  protected override handleLayoutEvent(eventData:BnGridWrapperEvent):void {
    if(!this.current) return;
    
    this.__renderView();
  }

  private __renderView(){
    if(!this.current) return;
    this.curVals = this.gridSvc.getWrapperCurVals(this.current,this.curVals);
    this.gridSvc.getPreHeaderAnimationConfig(this.animateConfig,this.current,this.fullWidth,this.curVals, this.curStates)
    if(this.curStates.fullScreenEvent){ this.aniToggle = !this.curStates.fullScreenEvent; }
    this.renderView(this.aniToggle)
  }


}