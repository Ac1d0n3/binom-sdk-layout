import { Injectable, NgZone} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ViewportRuler } from '@angular/cdk/overlay';
import { BnLoggerService, BnLogSource } from "@binom/sdk-core/logger";
import { BnLayoutInfo } from './bn-layout-info';
import { BnLayoutEvent } from './bn-layout-event';
import { BnLayoutScroll } from './bn-layout-scroll';


@Injectable({
  providedIn: 'root'
})
export class BnLayoutService {

  logSource:BnLogSource = {
    module: 'bnLayout',
    source: 'BnLayoutInfoService'
  }

  constructor(
    private logger: BnLoggerService, 
    private viewPort: ViewportRuler,
    private readonly ngZone: NgZone
  ) { 
   
    this.setLayoutInfo();
  }

  private eventCount:number = 0;

  public layoutInfo$:BehaviorSubject<BnLayoutInfo> = new BehaviorSubject({} as any);
  public layoutEvent$:BehaviorSubject<BnLayoutEvent> = new BehaviorSubject({} as any);
  public scrollInfo$:BehaviorSubject<BnLayoutScroll> = new BehaviorSubject({} as any);
  public updateScroll(value: BnLayoutScroll): void { this.scrollInfo$.next(value); }
  public layoutInfo!:BnLayoutInfo;

  private readonly viewportChange = this.viewPort.change().subscribe(() => this.ngZone.run(() => this.setLayoutInfo(true)));

  private setLayoutInfo(updateEvent:boolean = false):void {
    const { width, height } = this.viewPort.getViewportSize();
    this.layoutInfo = {
      isMobile: this.isMobile(),
      device: this.getdevice(),
      window: {
        orientation:this.getOrientation(),
        width: width || screen.width,
        height: height || screen.height,
        breakpoint: this.getBreakPoints()
      }
    }
    if(updateEvent) this.updateLayoutEvent('layoutInfoService', 'resize');
    this.layoutInfo$.next(this.layoutInfo);
  }

  public setScrollInfo(value:BnLayoutScroll):void{
    this.scrollInfo$.next(value);
  }

  getInfo(){
    return this.layoutInfo
  }

  public layoutEvent(calledBy:string ='layoutInfoService', source:string=''){ 
    this.updateLayoutEvent(calledBy,source);
  }

  private updateLayoutEvent(calledBy:string, source:string):void {
    this.eventCount++;
    this.layoutEvent$.next({ count: this.eventCount, lastCalledBy:calledBy, source: source })
  }

  public getBreakPoints():'small-x' | 'small' | 'medium' | 'large' | 'large-x'{
    if(window.innerWidth <= 599.98) return 'small-x';
    else if(window.innerWidth >= 600 && window.innerWidth <= 959.98) return 'small';
    else if(window.innerWidth >= 960 && window.innerWidth <= 1279.98) return 'medium';
    else if(window.innerWidth >= 1280 && window.innerWidth <= 1919.98) return 'large';
    else return 'large-x';
  }

  public getOrientation():'portrait'|'landscape'{
    let orientation:any = ''
    if( window.screen){
      if( window.screen.orientation){
      orientation = window.screen.orientation.type.replace('-primary','')
    }} else if( screen){
      if( screen.orientation){
      orientation = screen.orientation.type.replace('-primary','')
    }}
    return orientation
  }

  private legacyIsMobileCheck(): boolean{
    return /Mobi/i.test(window.navigator.userAgent.toLocaleLowerCase())
  }

  public isMobile(): boolean{ 
    return this.legacyIsMobileCheck();
  }

  public getdevice():'phone'|'tablet'|'desktop'{
    if(Math.min(window.screen.width, window.screen.height) < 768 || window.innerWidth < 768) return 'phone';
    else if(Math.min(window.screen.width, window.screen.height) < 1200 || window.innerWidth < 1200) return 'tablet';
    else return 'desktop';
  }

  public isMobilePhone(){ return this.layoutInfo.device === 'phone' && this.layoutInfo.isMobile ? true : false; }
  public isMobileTablet(){ return this.layoutInfo.device === 'tablet' && this.layoutInfo.isMobile ? true : false; }
  public isPhone(){ return this.layoutInfo.device === 'phone' ? true : false; }
  public isTablet(){ return this.layoutInfo.device === 'tablet' ? true : false; }
  public isPhoneNotMobile(){ return this.layoutInfo.device === 'phone'  && !this.layoutInfo.isMobile ? true : false; }
  public isTabletNotMobile(){ return this.layoutInfo.device === 'tablet'  && !this.layoutInfo.isMobile ? true : false; }
  public isNotPhone(){ return this.layoutInfo.device !== 'phone' ? true : false; }

  ngOnDestroy():void {
    this.viewportChange.unsubscribe();
  }

}
