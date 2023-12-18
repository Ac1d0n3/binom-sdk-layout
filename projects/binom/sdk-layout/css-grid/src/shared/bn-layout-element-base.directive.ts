import { Directive, Renderer2, ElementRef, Input, Output, EventEmitter, NgZone, inject } from '@angular/core';
import { coerceBooleanProperty, BooleanInput, NumberInput, coerceNumberProperty, coerceElement } from '@angular/cdk/coercion';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { AnimationBuilder, AnimationFactory, AnimationPlayer } from '@angular/animations';

import { BnLogMsg, BnLogSource, BnLoggerService } from '@binom/sdk-core/logger';
import { RendererUtils } from '@binom/sdk-core/utils';
import { BnGridWrapper } from '../interfaces/bn-grid-wrapper';
import { BnGridWrapperEvent } from '../interfaces/bn-grid-wrapper-event';
import { BnGridConfigService } from '../helper-svc/bn-grid-config.service';
import { BnLayoutGridService } from '../bn-layout-grid.service';
import { BnGridElements } from '../interfaces/elements/bn-grid-elements';


@Directive({
  standalone: true
})
export abstract class BnLayoutElementBaseDirective {
  // Logging
  private logger = inject(BnLoggerService);
  protected logSource:BnLogSource = { module: 'bnLayout', source: 'BnLayoutGridService' };
  private __logMsg(type:any, msg:BnLogMsg){ if(this.logger.doLog(this.logSource,type)){
      let formatMsg:any = this.logger.formatMsg(msg,this.logSource,type); console.log(formatMsg.msg,formatMsg.color);
  }}

  // Init Base
  protected configSvc = inject(BnGridConfigService);
  protected gridSvc = inject(BnLayoutGridService);
  protected renderUtil: RendererUtils;
  protected renderer = inject(Renderer2);
  protected el = inject(ElementRef);
  constructor() { this.renderUtil = new RendererUtils(this.renderer, this.el); }
  protected isInit: boolean = false;
  protected belongsToWrapper!: string;
  protected current: BnGridWrapper | null = null;
  protected elTag!: string;
  protected isServiceEvent:boolean = false;

  // Shadow
  private _shadowLevel:number = 4;
  get shadowLevel():number{ return this._shadowLevel; }
  @Input() set shadowLevel(val:NumberInput){ this._shadowLevel= coerceNumberProperty(val); }
  private _shadow: boolean = false;
  get shadow(): boolean { return this._shadow; }
  @Input() set shadow(val: BooleanInput) { 
    this._shadow = coerceBooleanProperty(val); 
    this.renderUtil.toggleShadow(this.shadow,this.shadowLevel);
  }

  //-------------------------------------------------------------------------------------
  // Visible
  @Output() visibleChange = new EventEmitter<boolean>();

  private _visible: boolean = true;
  get visible(): boolean { return this._visible; }
  @Input() set visible(val: boolean) { 
    this._visible = val; 
    this.__handleVisibleChange();
  }

  private __handleVisibleChange(){
    if(this.current){
      if(this.isInit && !this.isServiceEvent) {
        this.gridSvc.setVisibleByWrapper(this.current, this.elTag, this.visible, true,this.isServiceEvent);
      } else {
        this.visibleChange.emit(this.visible)
      }
      
      this.isServiceEvent = false;
    }
    this.toggleVisible();
   
  }

  protected updateVisible(eventData:BnGridWrapperEvent){
    if(eventData.wrapper === this.belongsToWrapper && this.current && eventData.source === this.elTag){
      if(eventData.action === 'visible'){
        this.isServiceEvent = true;
        this.visible = this.current.visible.active[this.elTag as keyof BnGridElements]
      }
    }
  }

  protected toggleVisible(){ 
    this.renderUtil.toggleVisible(this.visible); 
  }

  //-------------------------------------------------------------------------------------
  // ON INIT BASE Functions
  protected onInit(withEvent:boolean=true):void {
    if(withEvent) this.__initGridEvent();
    this.__checkBelongsTo();
    if(!this.current || !this.elTag) return;
    this.renderUtil.toggleShadow(this.shadow,this.shadowLevel);
    this.configSvc.setHas(this.current, this.elTag);
  }

  private __checkBelongsTo():void {
    this.belongsToWrapper = this.renderUtil.getParentNodeAttribute('ng-reflect-bn-layout-wrapper');
    if (this.belongsToWrapper) { 
      this.renderer.setAttribute(this.el.nativeElement, 'belongsto', this.belongsToWrapper);
      this.current = this.gridSvc.getCurrentWrapper(this.belongsToWrapper);
      this.renderUtil.addElementIdClasses(this.elTag,this.belongsToWrapper);
      if(!this.current) { this.__logMsg('warn', { function: 'Warning', msg: 'no Wrapper Object found for: ' + this.elTag }); }
      else { this.__logMsg('warn', { function: 'onInit #wrapper', msg: this.belongsToWrapper ? this.belongsToWrapper : 'null' });}
      if(this.current){
        this.configSvc.setActiveVisible(this.current,this.elTag,this.visible);
        this.configSvc.setDefaultVisible(this.current,this.elTag,this.visible);
      }
     
    } else {
      this.__logMsg('warn',  { function: 'Warning', msg: 'no Wrapper found for: ' + this.elTag });
      this.renderUtil.setBorder('red', '2px');
    }
  }

  private __initGridEvent():void{
    if(!this.isInit)
    this.subscriptions.push(
      this.gridSvc.wrapperChildEvent$.subscribe((eventData:BnGridWrapperEvent) => this.handleLayoutEvent(eventData))
    )
  }

  protected handleLayoutEvent(eventData:BnGridWrapperEvent):void {}

  //-------------------------------------------------------------------------------------
  // After View Init (INIT)
  protected ngAfterViewInit():void {
    this.isInit = true;
    this.afterViewInit();
  }
  protected afterViewInit():void{ }

  //-------------------------------------------------------------------------------------
  // Subscription & Destroy
  protected subscriptions: Array<Subscription> = new Array<Subscription>();
  protected ngOnDestroy():void{
    this.onDestroy();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  protected onDestroy():void{}


}
