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
    if(eventData.action === 'fullscreen'){ 
      this.fullScreenEvent = true; 
      this.fullScreenState = eventData.state? eventData.state : false;
      
    }
    if(eventData.source && (eventData.wrapper === this.belongsToWrapper || this.belongsToWrapper === '' )){
      if(eventData.action === 'visible' && eventData.source === this.elTag && eventData.wrapper === this.belongsToWrapper && eventData.outsideEvent){
        this.updateVisible(eventData);
      }
    }
    this.__renderView();
  }

  private __renderView(){
    if(!this.current) return;
    this.curVals = this.gridSvc.getWrapperCurVals(this.current);
    this.animateConfig = this.gridSvc.getPreHeaderAnimationConfig(this.current, this.curVals,this.fullWidth, this.fullScreenState)
    if(this.fullScreenEvent){ this.aniToggle = !this.fullScreenEvent; }
    this.renderView(this.aniToggle)
  }


}