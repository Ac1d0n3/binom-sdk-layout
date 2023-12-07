
import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';
import { Subscription } from "rxjs";
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import { BnLayoutInfo, BnLayoutService } from '@binom/sdk-layout/core';
import { BnGridInfo, BnLayoutGridService } from '@binom/sdk-layout/css-grid';

import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'bn-layout-switch',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatSelectModule, MatCheckboxModule , MatButtonModule,MatIconModule,MatMenuModule,MatTooltipModule ,MatSlideToggleModule, FormsModule  ],
  templateUrl: './bn-layout-switch.component.html',
  styleUrl: './bn-layout-switch.component.css',
  //providers: [BnLayoutGridService]
})
export class BnLayoutSwitchComponent {
  constructor(
    private layoutSvc: BnLayoutService,
    private gridSvc: BnLayoutGridService
  ) { }
  private subscriptions: Array<Subscription> = new Array<Subscription>();

  private  _enableToolTips:boolean = false;
  get enableToolTips(): boolean{ return this._enableToolTips; }
  @Input() set enableToolTips(val: BooleanInput) { this._enableToolTips = coerceBooleanProperty(val); }

  private  _onlyFirstWrapper:boolean = false;
  get onlyFirstWrapper(): boolean{ return this._onlyFirstWrapper; }
  @Input() set onlyFirstWrapper(val: BooleanInput) { this._onlyFirstWrapper = coerceBooleanProperty(val); }

  private  _allowGridSettings:boolean = false;
  get allowGridSettings(): boolean{ return this._allowGridSettings; }
  @Input() set allowGridSettings(val: BooleanInput) { this._allowGridSettings = coerceBooleanProperty(val); }

  private  _allowFullscreen:boolean = false;
  get allowFullscreen(): boolean{ return this._allowFullscreen; }
  @Input() set allowFullscreen(val: BooleanInput) { this._allowFullscreen = coerceBooleanProperty(val); }

  private  _allowVisible:boolean = false;
  get allowVisible(): boolean{ return this._allowVisible; }
  @Input() set allowVisible(val: BooleanInput) { this._allowVisible = coerceBooleanProperty(val); }

  private  _allowCalcHeights:boolean = false;
  get allowCalcHeights(): boolean{ return this._allowCalcHeights; }
  @Input() set allowCalcHeights(val: BooleanInput) { this._allowCalcHeights = coerceBooleanProperty(val); }


  @Input() allowedVisibleElements:string[] = ['preheader','sidebarleft','sidebarright','footer'];
  allowedGridSettings:string[] = ['grid','noInheritGrid','calcHeights','noInheritCalcHeights'];
  
  isInit:boolean = false;
  currentWrapper:any = {} as any;
  gridInfo:BnGridInfo = this.gridSvc.gridInfo;
  icon = 'fa-desktop';
  layoutInfo!:BnLayoutInfo;
  disableFullScreen:boolean = false;


  ngOnInit():void{
   
    let sub1 = this.layoutSvc.layoutInfo$.subscribe((data:any)=>{
      if(data){
        if(data.device === 'phone') this.icon = 'fa-mobile-alt';
        else if(data.device === 'tablet')  this.icon = 'fa-tablet-alt';
        else  this.icon = 'fa-desktop'
      }
      this.layoutInfo = data;
      this.disableFullScreen =  this.layoutSvc.isPhone();
      this.isInit = true;
    });
    this.subscriptions.push(sub1);
    this.currentWrapper = this.gridInfo.hierarchy[0]
  }

  change(){
   
  }

  changeWrapperVisible(el:string){
    let val = coerceBooleanProperty(this.currentWrapper.visible.active[el as keyof BnGridInfo])
    this.gridSvc.wrapperEvent('all','all',this.currentWrapper.config.level,el,'visible', val,true)
    //this.gridSvc.wrapperChildEvent(this.currentWrapper.wrapperId,el, 'visible',null,true);
   
  }


  changeValue(source:string){
    let val = coerceBooleanProperty(this.gridInfo[source as keyof BnGridInfo])
    this.gridSvc.wrapperEvent('all','all',this.currentWrapper.config.level,source,source, val,true)
  }


 trackByFn(index:number, item:any) {
    return item.wrapperId;
  }

  ngOnDestroy(){ this.subscriptions.forEach(subscription => subscription.unsubscribe());}
}
