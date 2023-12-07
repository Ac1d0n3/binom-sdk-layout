import { Directive, Input, inject } from '@angular/core';
import { BnLayoutElementBaseDirective } from '../shared/bn-layout-element-base.directive';
import { BnLogSource } from '@binom/sdk-core/logger';
import { BooleanInput, NumberInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { AnimationBuilder, AnimationFactory, AnimationPlayer } from '@angular/animations';
import { BnGridAnimateObject } from '../interfaces/bn-grid-animate-object';
import { BnLayoutScroll, BnLayoutService } from '@binom/sdk-layout/core';
import { BnGridWrapperEvent } from '../interfaces/bn-grid-wrapper-event';
import { BnWrapperCurVals } from '../interfaces/bn-wrapper-cur-vals';

@Directive({
  selector: '[bnLayoutHeader]',
  standalone: true
})
export class BnLayoutHeaderDirective extends BnLayoutElementBaseDirective {

  override elTag: string = 'header';
  override logSource: BnLogSource = { module: 'bnLayout', source: 'HeaderDirective' }

  private _sticky: boolean = false; get sticky(): boolean { return this._sticky;}
  @Input() set sticky(val: BooleanInput) { this._sticky = coerceBooleanProperty(val); }

  private _transparentAos: boolean = false; get transparentAos(): boolean { return this._transparentAos;}
  @Input() set transparentAos(val: BooleanInput) { this._transparentAos = coerceBooleanProperty(val); }

  private _fullWidth: boolean = false; get fullWidth(): boolean { return this._fullWidth;}
  @Input() set fullWidth(val: BooleanInput) { this._fullWidth = coerceBooleanProperty(val); }

  @Input() fullWidthContent:  'always' | 'none' | 'fullscreen' = 'none';

  private _height:number = 0;
  get height():number{ return this._height; }
  @Input() set height(val:NumberInput){ this._height= coerceNumberProperty(val); }

  private animBuilder = inject(AnimationBuilder);
  private layoutSvc = inject(BnLayoutService)
  private useScrollWrapper:string = 'bn-layout-app-wrapper';
  private scrollTop:number = 0;
  private scrollElOffset:number = 0;
  
  private curVals!:BnWrapperCurVals;

  private fullScreenEvent:boolean = false;
  private iconsSidebarEvent:boolean = false;
  private iconsSidebarState:boolean = false;
  private fullScreenState:boolean = false;

  private animationRun: boolean = false;
  private animationPlayer: AnimationPlayer | null = null;
  private animateConfig:BnGridAnimateObject = this.gridSvc.getDefaultAnimationConfig();

  ngOnInit():void{
    this.onInit();
    this.__initHeader();
  }

  protected override afterViewInit(): void { 
    this.__viewUpdate();
    this.__renderView();
  }

  private __viewUpdate(){
    if(!this.current) return;
    this.curVals = this.gridSvc.getWrapperCurVals(this.current);
    this.scrollElOffset = 0;
    this.scrollElOffset = this.gridSvc.getElementOffset(this.current.wrapperId, 0, true);
    if(this.sticky) this.__checkIsFixed();
    if(this.transparentAos) {
      this.renderUtil.toggleOnOff(this.scrollTop ===0 && this.gridSvc.isVisble(this.current,'preheader'), 'bnl-transparent-header-on','bnl-transparent-header-off');
    }
  }
  
  private __renderView(){
   
    if(!this.current) return;
    if(this.current.level === 0) {
      this.__setValsForRoot()
    } else {
      console.log('isChild')
    }

    console.log(this.animateConfig,this.aniToggle);
    this.__animateIt(this.aniToggle)
    
  }

  aniToggle:boolean = false;

  private __setValsForRoot(){
    if(!this.current) return;
    console.log('------------------------------------------------');
    console.log('RENDER VIEW');
    if(this.fullWidth || this.curVals.fullScreen){
      this.animateConfig.width.to = '100%';
      this.animateConfig.left.to =  '0px';
    } else {
      if(this.isFixed) {
        this.animateConfig.width.from = !this.curVals.useCenterSpace && this.curVals.useWidth === 0  ? '100%' : this.curVals.staticWidth +'px' ;
        this.animateConfig.width.to = !this.curVals.useCenterSpace && this.curVals.useWidth === 0 ? '100%' : this.curVals.staticWidth +'px' ;
        this.animateConfig.left.from = !this.curVals.useCenterSpace || this.curVals.fullScreen? '0px' : `${this.curVals.centerSpaceWidth}px`;
        this.animateConfig.left.to = !this.curVals.useCenterSpace || this.curVals.fullScreen? '0px' : `${this.curVals.centerSpaceWidth}px`;
      } else {
        this.animateConfig.width.to = '100%';
        this.animateConfig.left.to =  '0px';
        this.animateConfig.left.from =  '0px';
      }
    }

    if(this.fullWidth){

    }



    
  }

  private __setValsForRootOld(){
    if(!this.current) return;
    console.log('------------------------------------------------')
    console.log('RENDER VIEW')
  
   
    if(this.fullScreenEvent){
      this.aniToggle = !this.fullScreenEvent;
    }
    if(this.isFixed || this.curVals.fullScreen){
      
      console.log(this.fullScreenEvent, this.fullScreenState);
      console.log(this.curVals.useWidth, this.current.config.maxWidth)

      
      if(this.fullWidth){
        this.animateConfig.width.to = '100%';
        this.animateConfig.left.to =  '0px';
        if(this.fullScreenEvent){
          
          if(this.current.elConfig.header.fullWidthContent === 'fullscreen' && this.fullScreenState){
            this.animateConfig.padding.to = '0px 0px';
          }
          else {
            this.animateConfig.padding.to =  this.curVals.useCenterSpace ? '0px '+  this.curVals.centerSpaceWidth +'px': '0px 0px' ;
          }

        }

        if(this.current.elConfig.header.fullWidthContent === 'always'){
          this.animateConfig.padding.to = '0px 0px';
        
        }
       
      } else {
        console.log('BBBB')
        if(this.fullScreenEvent){
          this.animateConfig.width.from = !this.curVals.useCenterSpace && this.curVals.useWidth === 0 ? '100%' : this.curVals.staticWidth +'px' ;
          this.animateConfig.width.to = this.fullScreenState ? '100%' : this.curVals.staticWidth +'px' ;
          this.animateConfig.left.to = this.fullScreenState ? '0px' :`${this.curVals.centerSpaceWidth}px` ;
          
        } else {
          this.animateConfig.width.from = !this.curVals.useCenterSpace && this.curVals.useWidth === 0  ? '100%' : this.curVals.staticWidth +'px' ;
          this.animateConfig.width.to = !this.curVals.useCenterSpace && this.curVals.useWidth === 0 ? '100%' : this.curVals.staticWidth +'px' ;
          this.animateConfig.left.from = (!this.curVals.useCenterSpace  && !this.curVals.fullScreen) || (this.current.config.maxWidth === 0 && this.current.config.centered) ? '0px' : `${this.curVals.centerSpaceWidth}px`;
          this.animateConfig.left.to = !this.curVals.useCenterSpace || this.curVals.fullScreen? '0px' : `${this.curVals.centerSpaceWidth}px`;
          this.animateConfig.padding.to =  this.curVals.useCenterSpace ? '0px '+  this.curVals.centerSpaceWidth +'px': '0px 0px' ;
        }
      }

    } else {

      if(!this.current.config.centered && this.curVals.useWidth > 0){
        this.animateConfig.padding.to =  `0px ${this.curVals.centerSpaceWidth *2}px 0px 0px`
      } else {
        this.animateConfig.padding.to =  (this.current.config.centered && this.current.elConfig.header.fullWidth ? '0px '+  this.curVals.centerSpaceWidth +'px': '0px 0px' );
      }

      this.animateConfig.left.to = '0px';
      this.animateConfig.left.from = '0px';
      this.animateConfig.width.to = '100%';

 
    }

    if(this.current.elConfig.header.fullWidthContent === 'always'){
      this.animateConfig.padding.to = '0px 0px';
    
    }
  }

  /* ************************************************************************ 
      EVENT Handling
  */ 

  private __handleScroll(data:BnLayoutScroll): void {
    if(data.source === this.useScrollWrapper){ 
      this.scrollTop = data.y; 
      this.__viewUpdate();
    }
  }

  protected override handleLayoutEvent(eventData:BnGridWrapperEvent):void {
    if(!this.current) return;

    if(this.sticky || this.transparentAos){
      console.log('-->update sticky / transparent', this.elTag, this.belongsToWrapper, eventData)
      this.__viewUpdate();
    }

    if(eventData.action === 'fullscreen'){ 
      this.fullScreenEvent = true; 
      this.fullScreenState = eventData.state? eventData.state : false;
      this.__renderView();
    }
    if(eventData.source === 'toggleIconSidebar' ){
      this.iconsSidebarEvent = true;
      this.iconsSidebarState = coerceBooleanProperty(eventData.state);
      this.__renderView();
    }

    if(eventData.source && (eventData.wrapper === this.belongsToWrapper || this.belongsToWrapper === '' )){
      if(eventData.action === 'visible' && eventData.source === this.elTag && eventData.wrapper === this.belongsToWrapper && eventData.outsideEvent){
        console.log('-->should visible', this.elTag, this.belongsToWrapper)
        this.updateVisible(eventData);
      }
      if(eventData.action === 'visible' && eventData.source === this.elTag && eventData.wrapper === this.belongsToWrapper && !eventData.outsideEvent){
        console.log('-->should update widths', this.elTag, this.belongsToWrapper)
      }
      if(eventData.action === 'ngAfterViewInit' && eventData.level >= this.current.level){
        console.log('--> should update heights if calcHeights === true', this.elTag, this.belongsToWrapper);
      }
    }

    if(eventData.wrapper === 'all' && eventData.parent === 'all' && eventData.action === 'resize'){
      console.log('--> should update heights if calcHeights === true', this.elTag, this.belongsToWrapper);
      console.log('--> should update widths');
    }
   
  }

  private __initHeader(){
    if(!this.current) return

    if(this.sticky || this.transparentAos){
      this.subscriptions.push(this.layoutSvc.scrollInfo$.subscribe((data:BnLayoutScroll) => this.__handleScroll(data )) );
    }
    this.configSvc.setHeaderDefaults(this.current, this.sticky,this.fullWidth,this.transparentAos,this.fullWidthContent);
    this.configSvc.setElementHeight(this.current, this.elTag, this.height);
    this.renderUtil.setHeight(this.height);
    this.renderUtil.toggleZindex(true,'200');
  }

  /* ************************************************************************ 
      FIXED / Sticky / Transparent Header on AOS
  */ 

  private _isFixed:boolean = false;
  get isFixed():boolean { return this._isFixed}
  set isFixed(val:boolean) {
    this._isFixed = val;
    if(!this.current) return;
    console.log('------------------------------------------------')
    console.log('Fixed Changed Set Values')
    this.__renderView();
  }

  private __checkIsFixed(){
    const cur = this.scrollTop >= this.scrollElOffset ? true: false;
    if(cur !== this.isFixed){
      this.isFixed = cur;
    }
    this.renderUtil.toggleClass(this.isFixed, 'fixed');
  }
  
  /* ************************************************************************ 
      Render and Animation
  */ 

  private __renderHard(){

  }

  private __animateIt(toggle: boolean) {
    if (this.current) {
      this.animationRun = true;
      const metadata = toggle ? this.gridSvc.animateActiveMeta(this.animateConfig) : this.gridSvc.animateInactiveMeta(this.animateConfig)
      const factory: AnimationFactory = this.animBuilder.build(metadata);
      const player: AnimationPlayer = factory.create(this.el.nativeElement);

      player.onDone(() => {
        this.__animateItDone(toggle)
      });
      
      this.__destroyPlayer();
      this.animationPlayer = player;
      player.play();
    }
  }

  protected __destroyPlayer(){
    if (this.animationPlayer) {
      this.animationPlayer.destroy();
      this.animationPlayer = null;
    }
  }

  private __animateItDone(toggle: boolean){
    this.animateConfig.left.from = this.animateConfig.left.to
    this.animateConfig.width.from = this.animateConfig.width.to
    this.animateConfig.padding.from = this.animateConfig.padding.to
  }
  
}