import { Directive, Input, OnInit } from '@angular/core';
import { BnLayoutElementBaseDirective } from '../shared/bn-layout-element-base.directive';
import { BnLogSource } from '@binom/sdk-core/logger';
import { BnGridElements } from '../interfaces/elements/bn-grid-elements';
import { BooleanInput, NumberInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';

@Directive({
  selector: '[bnLayoutSidebar]',
  standalone: true
})
export class BnLayoutSidebarDirective extends BnLayoutElementBaseDirective {

  override elTag: string = 'sidebar';
  override logSource: BnLogSource = { module: 'bnLayout', source: 'SidebarDirective' };

  @Input() togglePosition:'middle'|'top'|'bootom' = 'middle';

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
      //this.renderUtil.setStyle('width', !this.iconSidebarToggle ? this.width +'px': this.layoutGridSvc.iconSidebarWidth+'px' );
      //this.layoutGridSvc.toggleIconSidebar(this.current,this.position, this.width, this.iconSidebarToggle);
      //if(this.visible){ this.__handleAnimate(); }
    }
  }

  private _createToggle:boolean = false; get createToggle():boolean{ return this._createToggle; }
  @Input() set createToggle(val:BooleanInput){ this._createToggle = coerceBooleanProperty(val); }

  private _createToggleOnPhone:boolean = false; get createToggleOnPhone():boolean{ return this._createToggleOnPhone; }
  @Input() set createToggleOnPhone(val:BooleanInput){ this._createToggleOnPhone = coerceBooleanProperty(val); }

  private _animated:boolean = false; get animated():boolean{ return this._animated; }
  @Input() set animated(val:BooleanInput){ this._animated= coerceBooleanProperty(val); }

  private _sticky: boolean = false; get sticky(): boolean { return this._sticky;}
  @Input() set sticky(val: BooleanInput) { this._sticky = coerceBooleanProperty(val); }


  ngOnInit():void{
    this.elTag = this.elTag + this.position;
    this.onInit();
    this.__initSidebar();
    
  }

  private __initSidebar(){
    if(this.current)
    this.configSvc.setSidebarDefaults(this.current, this.position, this.createToggle, this.createToggleOnPhone, this.inFooter, this.inHeader, this.iconSidebar, this.iconSidebarToggle, this.animated, !this.iconSidebarToggle && this.iconSidebar ? this.configSvc.iconSidebarWidth:this.width )
    this.renderUtil.setStyle('width',this.width +'px')
  }
  
}
