import { Directive, Input, OnInit } from '@angular/core';
import { BnLogSource } from '@binom/sdk-core/logger';
import { BooleanInput, NumberInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { BnLayoutElementAnimateBaseDirective } from '../shared/bn-layout-element-animate-base.directive';
import { BnLayoutScroll } from '@binom/sdk-layout/core';
import { BnGridWrapperEvent } from '../interfaces/bn-grid-wrapper-event';
import { BnGridSidebars } from '../interfaces/elements/bn-grid-sidebars';
import { AnimationFactory, AnimationPlayer } from '@angular/animations';

@Directive({
  selector: '[bnLayoutSidebar]',
  standalone: true
})
export class BnLayoutSidebarDirective extends BnLayoutElementAnimateBaseDirective{

  override elTag: string = 'sidebar';
  override logSource: BnLogSource = { module: 'bnLayout', source: 'SidebarDirective' };
  private useScrollWrapper:string = 'bn-layout-app-wrapper';
  private scrollTop:number = 0;
  private scrollElOffset:number = 0;
  private __stickyHelper!:HTMLElement;
  private helperPlayer: AnimationPlayer | null = null;
 

  private _width:number = 200;
  get width():number{ return this._width; }
  @Input() set width(val:NumberInput){ this._width= coerceNumberProperty(val); }

  @Input() set bnLayoutSidebar(value:'left'|'right'|''|undefined){ if(value !== '' && (value === 'right' || value === 'left')) this.position = value }
  @Input() position:'left'|'right' = 'left';

  private _inHeader:boolean = false; get inHeader():boolean{ return this._inHeader; }
  @Input() set inHeader(val:BooleanInput){ this._inHeader = coerceBooleanProperty(val); } 

  private _inFooter:boolean = false; get inFooter():boolean{ return this._inFooter; }
  @Input() set inFooter(val:BooleanInput){ this._inFooter= coerceBooleanProperty(val); }

  private _iconSidebar:boolean = false; get iconSidebar():boolean{ return this._iconSidebar; }
  @Input() set iconSidebar(val:BooleanInput){ this._iconSidebar= coerceBooleanProperty(val); }

  private _iconSidebarToggle:boolean = false; get iconSidebarToggle():boolean{ return this._iconSidebarToggle; }
  @Input() set iconSidebarToggle(val:boolean){ 
    this._iconSidebarToggle=val;
    if(this.current){
      this.renderUtil.setStyle('width', !this.iconSidebarToggle ? this.width +'px': this.configSvc.iconSidebarWidth+'px' );
      this.gridSvc.toggleIconSidebar(this.current, this.position, this.width, this.iconSidebarToggle);
    }
  }
  

  @Input() togglePosition:'middle'|'top'|'bootom' = 'middle';
  private _createToggle:boolean = false; get createToggle():boolean{ return this._createToggle; }
  @Input() set createToggle(val:BooleanInput){ this._createToggle = coerceBooleanProperty(val); }

  private _createToggleOnPhone:boolean = false; get createToggleOnPhone():boolean{ return this._createToggleOnPhone; }
  @Input() set createToggleOnPhone(val:BooleanInput){ this._createToggleOnPhone = coerceBooleanProperty(val); }

  private _sticky: boolean = false; get sticky(): boolean { return this._sticky;}
  @Input() set sticky(val: BooleanInput) { this._sticky = coerceBooleanProperty(val); }


  ngOnInit():void{
    this.elTag = this.elTag + this.position;
    this.onInit();
    this.__initSidebar();
  }

  protected override afterViewInit(): void {
    this.__viewUpdate()
    this.__renderView();
  }

  private __initSidebar(){
    if(!this.current) return;
   
    if(this.sticky){ 
      this.subscriptions.push(this.layoutSvc.scrollInfo$.subscribe((data:BnLayoutScroll) => this.__handleScroll(data )) ); 
    
    }
    let zIndex = 200 - (this.current.level * 2 + 1)
    this.renderUtil.setStyle('z-index',zIndex.toString());
    this.configSvc.setSidebarDefaults(this.current, this.position, this.createToggle, this.createToggleOnPhone, this.inFooter, this.inHeader, this.iconSidebar, this.iconSidebarToggle,  !this.iconSidebarToggle && this.iconSidebar ? this.configSvc.iconSidebarWidth:this.width )
    this.renderUtil.setStyle('width',this.width +'px');

  }

  private __viewUpdate(){
    if(!this.current) return;
    this.curVals = this.gridSvc.getWrapperCurVals(this.current,this.curVals);
    this.scrollElOffset = 0;
    this.scrollElOffset = this.gridSvc.getElementOffset(this.current.wrapperId, 0, true);
    if(this.sticky) this.__checkIsFixed();
  }
  
  private __renderView(){
    if(!this.current) return;
    if(this.curStates.fullScreenEvent){ this.aniToggle = !this.curStates.fullScreenEvent; }
    else if(this.curStates.iconsSidebarEvent){ this.aniToggle = !this.curStates.iconsSidebarState; }
    else this.aniToggle = !this.visible;

    this.animateConfig = this.gridSvc.getSidebarAnimateConfig(this.visible,this.width,this.current,this.position,this.curVals,this.curStates);
   
    if(this.isFixed){
      this.renderUtil.setStyle('top', (this.current.elConfig.sidebars[this.position as keyof BnGridSidebars].inHeader? 0 : this.current.heights.header) + 'px');
      this.renderUtil.setHeight(this.current.heights.wrapper - this.current.heights.header  );
    } else {
      this.renderUtil.removeStyle('top');
      this.renderUtil.removeStyle('height');
    }
   
    this.renderViewHelper(this.aniToggle);
    this.renderView(this.aniToggle);

  }

  protected override toggleVisible(){ this.__renderView() }

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
    if(this.sticky){ this.__viewUpdate(); }
    if(eventData.action === 'fullscreen'){ 
      this.__renderView();
    }
    if(eventData.source === 'toggleIconSidebar' && eventData.wrapper === this.belongsToWrapper  && eventData.action === this.position){
      this.__renderView();
    }
    if(eventData.source === 'appwrapper' && eventData.action === 'resize'){ 
      this.__renderView();
    }
  }

  protected animateItHelper(toggle: boolean) {
    if (this.current) {
      this.animationRun = true;
      const metadata = toggle ? this.gridSvc.animateActiveMeta(this.animateConfig) : this.gridSvc.animateInactiveMeta(this.animateConfig)
      const factory: AnimationFactory = this.animBuilder.build(metadata);
      const player: AnimationPlayer = factory.create(this.__stickyHelper);
      player.onDone(() => {this.renderHardHelper()});
      this.destroyPlayer();
      if( this.helperPlayer ) this.helperPlayer.destroy();
      this.helperPlayer = player;
      player.play();
    }
  }
  
  /* ************************************************************************ 
      FIXED / Sticky / Transparent Header on AOS
  */ 
  
  private _isFixed:boolean = false;
  get isFixed():boolean { return this._isFixed}
  set isFixed(val:boolean) {
    if(this.isFixed !== val){ this.curStates.fixedChanged = true }
    this._isFixed = val;
    this.curStates.isFixed = val;
    this.__renderView();
  }

  private __checkIsFixed(){
    const cur = this.scrollTop >= this.scrollElOffset ? true: false;
    if(cur !== this.isFixed){ this.isFixed = cur; }
    this.toogleSticky(this.isFixed)
  }

  protected __createStickyHelper(){
    if(!this.__stickyHelper){
      this.__stickyHelper = this.renderer.createElement('div');
      this.renderUtil.insertBefore(this.__stickyHelper);
    }
  }

  protected toogleSticky(toggle:boolean){
    this.__createStickyHelper();
    if(toggle ){
      if(!this.current || !this.__stickyHelper) return;
      this.renderUtil.addClass('fixed');
      this.renderer.setStyle( this.__stickyHelper ,'grid-area','sidebar'+this.position);
      this.renderer.setStyle( this.__stickyHelper , 'display', 'block');
      let zIndex = 200 - (this.current.level + 2)
      this.renderer.setStyle( this.__stickyHelper ,'z-index',zIndex.toString());
    } else {
      this.renderUtil.removeClass('fixed'); 
      this.renderer.setStyle( this.__stickyHelper ,'grid-area','none');
      this.renderer.setStyle( this.__stickyHelper , 'display', 'none');
    }
  } 

  renderViewHelper(toggle: boolean){
    if(!this.current || !this.__stickyHelper) return;
    this.current.config.animated? this.animateItHelper(toggle) : this.renderHardHelper();
  }


  renderHardHelper(){
    this.renderer.setStyle(this.__stickyHelper , 'left',this.animateConfig.left.to.toString());
    this.renderer.setStyle(this.__stickyHelper , 'width',this.animateConfig.width.to.toString());
    this.renderer.setStyle(this.__stickyHelper , 'padding',this.animateConfig.padding.to.toString());
  }
  
}
