import { Directive, Input, inject } from '@angular/core';
import { BnLogSource } from '@binom/sdk-core/logger';
import { BooleanInput, NumberInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { BnLayoutScroll} from '@binom/sdk-layout/core';
import { BnGridWrapperEvent } from '../interfaces/bn-grid-wrapper-event';
import { BnWrapperCurVals } from '../interfaces/bn-wrapper-cur-vals';
import { BnLayoutElementAnimateBaseDirective } from '../shared/bn-layout-element-animate-base.directive';

@Directive({
  selector: '[bnLayoutHeader]',
  standalone: true
})
export class BnLayoutHeaderDirective extends BnLayoutElementAnimateBaseDirective{
  override elTag: string = 'header';
  override logSource: BnLogSource = { module: 'bnLayout', source: 'HeaderDirective' }

  private _sticky: boolean = false; get sticky(): boolean { return this._sticky;}
  @Input() set sticky(val: BooleanInput) { this._sticky = coerceBooleanProperty(val); }

  private _transparentAos: boolean = false; get transparentAos(): boolean { return this._transparentAos;}
  @Input() set transparentAos(val: BooleanInput) { this._transparentAos = coerceBooleanProperty(val); }

  private _height:number = 0; get height():number{ return this._height; }
  @Input() set height(val:NumberInput){ this._height= coerceNumberProperty(val); }

  private useScrollWrapper:string = 'bn-layout-app-wrapper';
  private scrollTop:number = 0;
  private scrollElOffset:number = 0;


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
     
      this.animateConfig = this.gridSvc.getHeaderAnimationConfig(this.animateConfig, this.current, this.curVals,this.fullWidth, this.isFixed, this.fullScreenState)
      this.renderView(this.aniToggle);
    } else {
      console.log('isChild')
    }
    if(this.fullScreenEvent){ this.aniToggle = !this.fullScreenEvent; }
    
    //console.log(this.animateConfig,this.aniToggle);
   
    this.iconsSidebarEvent = false;
    this.fullScreenEvent = false;
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

    if(this.sticky || this.transparentAos){ this.__viewUpdate(); }

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
        this.updateVisible(eventData);
      }
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
    this.__renderView();
  }

  private __checkIsFixed(){
    const cur = this.scrollTop >= this.scrollElOffset ? true: false;
    if(cur !== this.isFixed){
      this.isFixed = cur;
    }
    this.renderUtil.toggleClass(this.isFixed, 'fixed');
  }

}