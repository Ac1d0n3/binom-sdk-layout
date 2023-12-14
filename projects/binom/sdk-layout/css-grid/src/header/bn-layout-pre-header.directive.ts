import { Directive, Input } from '@angular/core';
import { BnLogSource } from '@binom/sdk-core/logger';
import { BooleanInput, NumberInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { BnLayoutElementAnimateBaseDirective } from '../shared/bn-layout-element-animate-base.directive';
import { BnGridWrapperEvent } from '../interfaces/bn-grid-wrapper-event';

@Directive({
  selector: '[bnLayoutPreHeader]',
  standalone: true
})
export class BnLayoutPreHeaderDirective extends BnLayoutElementAnimateBaseDirective {

  override elTag: string = 'preheader';
  override logSource: BnLogSource = { module: 'bnLayout', source: 'PreHeaderDirective' }

  private _height:number = 0;
  get height():number{ return this._height; }
  @Input() set height(val:NumberInput){ this._height= coerceNumberProperty(val); }

  private _fullHeight: boolean = false;
  get fullHeight(): boolean { return this._fullHeight;}
  @Input() set fullHeight(val: BooleanInput) { this._fullHeight = coerceBooleanProperty(val); }


  ngOnInit():void{
    this.onInit();
    this.__initPreheader();
  }
  
  private __initPreheader(){
    if(!this.current) return;
    this.configSvc.setElementHeight(this.current, this.elTag, this.height);
    if(this.height > 0) this.renderUtil.setHeight(this.height);
    else this.renderUtil.setStyle('height','fit-content');

    this.configSvc.setPreheaderDefaults(this.current, this.height,  this.fullHeight, this.fullWidth, this.fullWidthContent);
  }

  override afterViewInit(){
    if(this.height === 0 && this.current){
      this.configSvc.setElementHeight(this.current, this.elTag, this.el.nativeElement.offsetHeight);
    }
    this.__renderView()
  }

  protected override handleLayoutEvent(eventData:BnGridWrapperEvent):void {
    if(!this.current) return;
    if(eventData.action === 'fullscreen'){ 
      this.fullScreenEvent = true; 
      this.fullScreenState = eventData.state? eventData.state : false;
      this.__renderView();
    }
    if(eventData.source && (eventData.wrapper === this.belongsToWrapper || this.belongsToWrapper === '' )){
      if(eventData.action === 'visible' && eventData.source === this.elTag && eventData.wrapper === this.belongsToWrapper && eventData.outsideEvent){
        console.log('-->should visible', this.elTag, this.belongsToWrapper)
        this.updateVisible(eventData);
      }
    }
  }

  private __renderView(){
    if(!this.current) return;
    this.curVals = this.gridSvc.getWrapperCurVals(this.current);
    this.animateConfig = this.gridSvc.getPreHeaderAnimationConfig(this.current, this.curVals,this.fullWidth, this.fullScreenState)
    if(this.fullScreenEvent){ this.aniToggle = !this.fullScreenEvent; }
    this.renderView(this.aniToggle)
  }


}