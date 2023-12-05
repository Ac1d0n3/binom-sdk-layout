import { Directive, ElementRef, Input, Renderer2, inject } from '@angular/core';
import { BnLogMsg, BnLogSource, BnLoggerService } from '@binom/sdk-core/logger';
import { RendererUtils } from '@binom/sdk-core/utils';
import { BnLayoutGridService } from '../bn-layout-grid.service';
import { BnGridConfigService } from '../helper-svc/bn-grid-config.service';
import { Subscription, fromEvent } from 'rxjs';
import { BnLayoutEvent, BnLayoutService } from '@binom/sdk-layout/core';

@Directive({
  selector: '[bnLayoutAppWrapper]',
  standalone: true
})
export class BnLayoutAppWrapperDirective {
  // Logging
  private logger = inject(BnLoggerService);
  private logSource:BnLogSource = { module: 'bnLayout', source: 'bnLayoutAppWrapper' };
  private __logMsg(type:any, msg:BnLogMsg){
    if(this.logger.doLog(this.logSource,type)){
      let formatMsg:any = this.logger.formatMsg(msg,this.logSource,type)
      console.log(formatMsg.msg,formatMsg.color);
    }
  }

  // Init Base
  private configSvc = inject(BnGridConfigService);
  private gridSvc = inject(BnLayoutGridService);
  private layoutSvc = inject(BnLayoutService);
  protected renderUtil: RendererUtils;
  protected renderer = inject(Renderer2);
  protected el = inject(ElementRef);

  constructor() { 
    this.renderUtil = new RendererUtils(this.renderer, this.el);
  }

  private subscriptions: Array<Subscription> = new Array<Subscription>();
  private _fullscreen: boolean = false;
  get fullscreen(): boolean  { return this._fullscreen; }
  @Input() set fullscreen(val: boolean) {
    this._fullscreen = val;
    this.gridSvc.setFullScreen(this._fullscreen);
  }

  private _grid: boolean  = false;
  get grid(): boolean  { return this._grid; }
  @Input() set grid(val: boolean) {
    this._grid = val;
  }

  private _fixedHeights: boolean  = false;
  get fixedHeights(): boolean  { return this._fixedHeights; }
  @Input() set fixedHeights(val: boolean) {
    this._fixedHeights = val;
  }

  private __initLayoutEventListener() {
    this.subscriptions.push( this.layoutSvc.layoutEvent$.subscribe((data: BnLayoutEvent) => this.__handleEvent(data)) );
  }

  private __handleEvent(data: BnLayoutEvent) {
    if(data.lastCalledBy === 'layoutInfoService' && data.source === 'resize'){
      this.gridSvc.wrapperEvent('all','all',0, 'appwrapper', 'resize');
    }
  }

  ngOnInit(): void {
    this.__initLayoutEventListener();
    this.renderUtil.addClasses(['bn-layout-app-container']);

  }

  ngAfterViewInit(): void {
    this.__logMsg('debug', {function:'updateLayoutEvent', msg: 'init AppScroll ' });
    this.subscriptions.push(
      fromEvent(this.el.nativeElement, 'scroll')
      .subscribe((scrollEvent:any) => {
        this.layoutSvc.updateScroll({source:'bn-layout-app-wrapper',y: scrollEvent.target.scrollTop || 0, x: 0})
      })
    )
   
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  
}
