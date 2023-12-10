import { Directive, Renderer2, ElementRef, Input, Output, EventEmitter, inject } from '@angular/core';
import { coerceBooleanProperty, BooleanInput, NumberInput, coerceNumberProperty } from '@angular/cdk/coercion';
import { Subscription } from 'rxjs';
import { AnimationBuilder, AnimationFactory, AnimationPlayer } from '@angular/animations';

import { BnLogMsg, BnLogSource, BnLoggerService } from '@binom/sdk-core/logger';
import { RendererUtils } from '@binom/sdk-core/utils';
import { BnGridWrapper } from '../interfaces/bn-grid-wrapper';
import { BnGridConfigService } from '../helper-svc/bn-grid-config.service';
import { BnLayoutGridService } from '../bn-layout-grid.service';
import { BnGridElements } from '../interfaces/elements/bn-grid-elements';
import { BnGridAnimateObject } from '../interfaces/bn-grid-animate-object';
import { BnGridWrapperEvent } from '../interfaces/bn-grid-wrapper-event';
import { BnLayoutService } from '@binom/sdk-layout/core';
import { BnWrapperCurVals } from '../interfaces/bn-wrapper-cur-vals';


@Directive({
  selector: '[BnLayoutElementAninamtedBase]',
  standalone: true
})
export abstract class BnLayoutElementAnimateBaseDirective {
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
  protected layoutSvc = inject(BnLayoutService)
  protected animBuilder = inject(AnimationBuilder);
  constructor() { this.renderUtil = new RendererUtils(this.renderer, this.el); }
  protected isInit: boolean = false;
  protected belongsToWrapper!: string;
  protected current: BnGridWrapper | null = null;
  protected elTag!: string;
  protected isServiceEvent:boolean = false;
  protected curVals!:BnWrapperCurVals;
  protected animationRun: boolean = false;
  private animationPlayer: AnimationPlayer | null = null;
  protected animateConfig:BnGridAnimateObject = this.gridSvc.getDefaultAnimationConfig();
  protected aniToggle:boolean = false;

  protected fullScreenEvent:boolean = false;
  protected iconsSidebarEvent:boolean = false;
  protected iconsSidebarState:boolean = false;
  protected fullScreenState:boolean = false;

  // Shadow
  private _shadowLevel:number = 4;
  get shadowLevel():number{ return this._shadowLevel; }
  @Input() set shadowLevel(val:NumberInput){ this._shadowLevel= coerceNumberProperty(val); }
  private _shadow: boolean = false;
  get shadow(): boolean { return this._shadow; }
  @Input() set shadow(val: BooleanInput) { this._shadow = coerceBooleanProperty(val); }


  private _fullWidth: boolean = false; get fullWidth(): boolean { return this._fullWidth;}
  @Input() set fullWidth(val: BooleanInput) { this._fullWidth = coerceBooleanProperty(val); }

  @Input() fullWidthContent:  'always' | 'none' | 'fullscreen' = 'fullscreen';


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

    if(this.current.has[this.elTag as keyof BnGridElements]){
      this.__logMsg('warn',  { function: 'Warning', msg: 'Dublicate Element for: ' + this.elTag });
      this.renderUtil.setStyle('display', 'none', true);
    }

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

  protected animateIt(toggle: boolean) {
    if (this.current) {
      this.animationRun = true;
      const metadata = toggle ? this.gridSvc.animateActiveMeta(this.animateConfig) : this.gridSvc.animateInactiveMeta(this.animateConfig)
      const factory: AnimationFactory = this.animBuilder.build(metadata);
      const player: AnimationPlayer = factory.create(this.el.nativeElement);

      player.onDone(() => {
        this.animateItDone(toggle)
      });
      
      this.destroyPlayer();
      this.animationPlayer = player;
      player.play();
    }
  }

  protected destroyPlayer(){
    if (this.animationPlayer) {
      this.animationPlayer.destroy();
      this.animationPlayer = null;
    }
  }

  protected animateItDone(toggle: boolean){
    this.animateConfig.left.from = this.animateConfig.left.to
    this.animateConfig.width.from = this.animateConfig.width.to
    this.animateConfig.padding.from = this.animateConfig.padding.to
    this.renderHard();
  }

  protected renderHard(){
    this.renderUtil.setStyle('left',this.animateConfig.left.to.toString());
    this.renderUtil.setStyle('width',this.animateConfig.width.to.toString());
    this.renderUtil.setStyle('padding',this.animateConfig.padding.to.toString());
  }

  protected renderView(toggle: boolean){

    if(!this.current) return;
    console.log()
    this.current.config.animated? this.animateIt(toggle) : this.renderHard();
  }

}
