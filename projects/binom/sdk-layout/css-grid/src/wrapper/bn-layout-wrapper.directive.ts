import { Directive, ElementRef, Input, Renderer2, inject } from '@angular/core';
import { BnLogMsg, BnLogSource, BnLoggerService } from '@binom/sdk-core/logger';
import { RendererUtils } from '@binom/sdk-core/utils';
import { BnLayoutGridService } from '../bn-layout-grid.service';
import { BnGridConfigService } from '../helper-svc/bn-grid-config.service';
import { BnGridWrapper } from '../interfaces/bn-grid-wrapper';
import { BooleanInput, NumberInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { AnimationBuilder, AnimationFactory, AnimationPlayer, animate, style } from '@angular/animations';
import { Subscription } from 'rxjs';

import { BnGridWrapperEvent } from '../interfaces/bn-grid-wrapper-event';
import { BnGridCss } from '../interfaces/bn-grid-css';

@Directive({
  selector: '[bnLayoutWrapper]',
  standalone: true
})
export class BnLayoutWrapperDirective {

   // Logging
   private logger = inject(BnLoggerService);
   private logSource:BnLogSource = { module: 'bnLayout', source: 'bnLayoutWrapper' };
   private __logMsg(type:any, msg:BnLogMsg){
     if(this.logger.doLog(this.logSource,type)){
       let formatMsg:any = this.logger.formatMsg(msg,this.logSource,type)
       console.log(formatMsg.msg,formatMsg.color);
     }
   }
 
   // Init Base
   private configSvc = inject(BnGridConfigService);
   private gridSvc = inject(BnLayoutGridService);

   protected renderUtil: RendererUtils;
   private renderer = inject(Renderer2);
   private el = inject(ElementRef);
   private animBuilder = inject(AnimationBuilder);
   private animationPlayer: AnimationPlayer | null = null;
   private subscriptions: Array<Subscription> = new Array<Subscription>();
   private isInit: boolean = false;
   private current:BnGridWrapper|null = null;
   private fullScreenEvent:boolean = false;
   private lastevent:any;
   private firstEvent:boolean = true;
 
   constructor() { 
     this.renderUtil = new RendererUtils(this.renderer, this.el);
   }

   //------------------------------------------------------------------------------------------
   // Wrapper ID and Parent
   @Input() wrapperId: string = '';
   @Input() set bnLayoutWrapper(val: string) { this.wrapperId = val };

   @Input() parentId: string = '';
   
   //------------------------------------------------------------------------------------------
   // Width and Height
   @Input() width: string = '100%';
   @Input() height: string = '100%';

   private _minWidth: number = 0;
   get minWidth(): number { return this._minWidth; }
   @Input() set minWidth(val: NumberInput) { this._minWidth = coerceNumberProperty(val); }
 
   private _offsetTop: number = 0;
   get offsetTop(): number { return this._offsetTop; }
   @Input() set offsetTop(val: NumberInput) { this._offsetTop = coerceNumberProperty(val); }
 
   private _offsetBottom: number = 0;
   get offsetBottom(): number { return this._offsetBottom; }
   @Input() set offsetBottom(val: NumberInput) { this._offsetBottom = coerceNumberProperty(val); }
 
   private _maxWidth: number = 0;
   get maxWidth(): number { return this._maxWidth; }
   @Input() set maxWidth(val: NumberInput) { 
     this._maxWidth = coerceNumberProperty(val); 
   }

   //------------------------------------------------------------------------------------------
  // Center Settings
  private _centered: boolean = false;
  get centeredX(): boolean { return this._centered; }
  @Input() set centered(val: BooleanInput) { this._centered = coerceBooleanProperty(val); }



  //------------------------------------------------------------------------------------------
  // Grid Settings
  private _grid: boolean = true;
  get grid(): boolean { return this._grid; }
  @Input() set grid(val: BooleanInput) { this._grid = coerceBooleanProperty(val); }

  private _noInheritGrid: boolean = false;
  get noInheritGrid(): boolean { return this._noInheritGrid; }
  @Input() set noInheritGrid(val: BooleanInput) { this._noInheritGrid = coerceBooleanProperty(val); }

  private _calcHeights: boolean = false;
  get calcHeights(): boolean { return this._calcHeights; }
  @Input() set calcHeights(val: BooleanInput) { this._calcHeights = coerceBooleanProperty(val); }

  private _noInheritCalcHeights: boolean = false;
  get noInheritCalcHeights(): boolean { return this._noInheritCalcHeights; }
  @Input() set noInheritCalcHeights(val: BooleanInput) { this._noInheritCalcHeights = coerceBooleanProperty(val); }

  //------------------------------------------------------------------------------------------
  // Other
  private _noFullScreen: boolean = false;
  get noFullScreen(): boolean { return this._noFullScreen; }
  @Input() set noFullScreen(val: BooleanInput) { this._noFullScreen = coerceBooleanProperty(val); }

  private _shadowLevel:number = 8;
  get shadowLevel():number{ return this._shadowLevel; }
  @Input() set shadowLevel(val:NumberInput){ this._shadowLevel= coerceNumberProperty(val); }
  private _shadow: boolean = false;
  get shadow(): boolean { return this._shadow; }
  @Input() set shadow(val: BooleanInput) { this._shadow = coerceBooleanProperty(val); }

  private _wrapperOffset:number = 0;
  get wrapperOffset():number{ return this._wrapperOffset; }
  @Input() set wrapperOffset(val:NumberInput){ this._wrapperOffset= coerceNumberProperty(val); }

  private _animated:boolean = true; get animated():boolean{ return this._animated; }
  @Input() set disableAnimated(val:BooleanInput){ this._animated= coerceBooleanProperty(!val); }

  //------------------------------------------------------------------------------------------
  //  
  ngOnInit(): void {
    let usedRandom:boolean = false;
    // check WrapperId 
    if(this.wrapperId === '') {
      usedRandom = true;
      this.wrapperId = this.gridSvc.randomId();
      this.renderer.setAttribute(this.el.nativeElement, 'ng-reflect-bn-layout-wrapper', this.wrapperId);
      this.__logMsg('warn', { function:'ngOnInit', msg: 'no WrapperId provided - use random:' + this.wrapperId } );
    }

    // check if nested Grid
    if(this.parentId === '') {
      const parent = this.renderer.parentNode(this.el.nativeElement);
      const parentParent = this.renderer.parentNode(parent);
      const parentId =  parentParent.getAttribute('belongsto');
      if(parentId){
        this.__logMsg('warn', { function:'ngOnInit', msg: 'no parentId for nested provided - use autoparent:' + parentId } );
        this.parentId = parentId;
      }
    }
   
    // Set current Wrapper Settings
    this.current = this.gridSvc.gridNodeHierarchy(this.wrapperId, this.parentId);
    
    if(this.current) {
      if(usedRandom) {
        this.current.isRandom = true
      }
     

      this.renderUtil.addElementIdClasses('bnl-wrapper', this.wrapperId);
      this.configSvc.setWrapperDefaults( this.current, this.grid, this.animated, this.noInheritGrid, this.calcHeights, this.noInheritCalcHeights, this.noFullScreen, this._centered, this.offsetTop, this.offsetBottom);
      this.__updateWrapperWidths();
      this.__initLayoutEventListener();

      this.__logMsg('debug',{ function:'ngOnInit - #wrapper', msg: this.wrapperId + ' called', info: this.current} );
    }
  
  }

  private __updateWrapperWidths():void{
    if(this.current) {
      if(this.current.parentId == '' || this.maxWidth !== 0)
      this.configSvc.setWrapperMaxWidth(this.current, this.maxWidth);
      this.configSvc.setWrapperWidth(this.current, this.width);
    }
  }

  ngAfterViewInit(): void {
    this.isInit = true;

    if(!this.current)return;

    this.gridSvc.calcHeights(this.current);
    this.gridSvc.wrapperChildEvent(this.wrapperId,this.parentId,this.current.level, 'appwrapper', 'ngAfterViewInit');
    this.updateView();
    this.__logMsg('debug',{ function:'ngAfterViewInit - #wrapper', msg: this.wrapperId + ' called'} );
  }

  private __initLayoutEventListener() {
    this.subscriptions.push( this.gridSvc.wrapperEvent$.subscribe((data: BnGridWrapperEvent) => this.__handleEvent(data)) );
  }

  private __updateHeight(){
    if(this.current){
      if(this.gridSvc.checkCalcHeights(this.current)){
        this.renderUtil.setStyle('height',this.current.heights.wrapper+'px');
      } else {
        this.renderUtil.setStyle('height','auto');
      }
    }
  }


  private __handleEvent(data: BnGridWrapperEvent) {
    this.fullScreenEvent = false;
    if(!this.current) return;
    if(data.wrapper){
      this.__logMsg('debug', { function:'Wrapper Event for: ' +this.wrapperId, msg: 'source: ' +data.source + ' action: '+ data.action  } );
      if(JSON.stringify(data) !== JSON.stringify(this.lastevent)){
        this.lastevent = data;
        if(data.action === 'fullscreen'){
          this.fullScreenEvent = true;
        }
      }
      if((data.wrapper === 'all' && data.parent === 'all') || (data.action === 'visible' )){
        this.gridSvc.calcHeights(this.current);
        this.gridSvc.wrapperChildEvent(this.wrapperId, this.parentId, data.level, data.source, data.action, data.state, data.outsideEvent);
       
      } 
      if(data.source === 'appwrapper' && data.action === 'updatesettings'){
        this.firstEvent = true;
        this.fullScreenEvent = false;
      }
    }
    this.updateView();
  }

  private updateView(){
    if(this.current && this.isInit){
      this.gridSvc.calcHeights(this.current);
      this.__toggleGridView();
      this.__toggleShadow(true);
      this.__updateHeight();
      this.firstEvent = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.__logMsg('debug', { function:'ngOnDestroy', msg: this.wrapperId + ' called'} );
  }

  //------------------------------------------------------------------------------
  // Renderer Helper Classes

  private __toggleGridView(){
    if(this.current && this.isInit){
      this.gridSvc.checkGrid(this.current) ? this.__gridView(this.gridSvc.getGridSettings(this.current)):this.__blockView();
    }
  }

  curCol:string = '*'
  private __gridView(gridSettings: BnGridCss) {
    if(!this.current) return;
    this.__removeGridClasses();
    const fromColumns = this.curCol;
    const toColumns = gridSettings.gridColumns;
    if(this.fullScreenEvent && !this.firstEvent && this.current.config.animated) {
      this.fullScreenEvent = false;
      this.animateGridColumns(fromColumns, toColumns);
     //console.log(fromColumns,toColumns)
    }
    else this.renderUtil.setStyle('grid-template-columns', toColumns);
    this.renderUtil.addClass('bnl-grid-' + gridSettings.deviceSize);
    this.renderUtil.setStyle('grid-template-rows', gridSettings.gridRows);
    this.renderUtil.setStyle('grid-template-areas', gridSettings.gridAreas);
    this.fullScreenEvent = false;
    this.curCol = toColumns
  }

  private __blockView() {
    this.__removeGridClasses();
    this.renderUtil.removeStyles(['grid-template-columns', 'grid-template-rows', 'grid-template-areas']);
    this.renderUtil.addClass('bnl-no-grid');
  }

  private __removeGridClasses(){
    this.renderUtil.removeClasses(['bnl-grid-desktop', 'bnl-grid-tablet', 'bnl-grid-phone', 'bnl-no-grid']);
  }

  private __toggleShadow(toggle:boolean){
    this.renderUtil.toggleShadow(this.shadow && toggle, this.shadowLevel);
  }

  private animateGridColumns(fromColumns: string, toColumns: string) {
   
    const metadata = [
      style({ gridTemplateColumns: fromColumns }),
      animate('300ms ease-in-out', style({ gridTemplateColumns: toColumns }))
    ];
    const factory: AnimationFactory = this.animBuilder.build(metadata);
    const player: AnimationPlayer = factory.create(this.el.nativeElement);
    player.onDone(() => {
      if (this.animationPlayer === player) {
        this.animationPlayer = null;
        player.destroy();
      }
      this.renderUtil.setStyle('grid-template-columns', toColumns);
    });
    this.animationPlayer = player;
    player.play();
  }

}
