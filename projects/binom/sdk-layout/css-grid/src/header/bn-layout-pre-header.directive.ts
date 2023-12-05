import { Directive, Input } from '@angular/core';
import { BnLayoutElementBaseDirective } from '../shared/bn-layout-element-base.directive';
import { BnLogSource } from '@binom/sdk-core/logger';
import { BooleanInput, NumberInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';

@Directive({
  selector: '[bnLayoutPreHeader]',
  standalone: true
})
export class BnLayoutPreHeaderDirective extends BnLayoutElementBaseDirective {

  override elTag: string = 'preheader';
  override logSource: BnLogSource = { module: 'bnLayout', source: 'PreHeaderDirective' }

  private _height:number = 0;
  get height():number{ return this._height; }
  @Input() set height(val:NumberInput){ this._height= coerceNumberProperty(val); }

  private _fullHeight: boolean = false;
  get fullHeight(): boolean { return this._fullHeight;}
  @Input() set fullHeight(val: BooleanInput) { this._fullHeight = coerceBooleanProperty(val); }

  private _fullWidth: boolean = false;
  get fullWidth(): boolean { return this._fullWidth;}
  @Input() set fullWidth(val: BooleanInput) { this._fullWidth = coerceBooleanProperty(val); }

  private _useMaxWitdhForContent: boolean = false;
  get useMaxWitdhForContent(): boolean { return this._useMaxWitdhForContent;}
  @Input() set useMaxWitdhForContent(val: BooleanInput) { this._useMaxWitdhForContent = coerceBooleanProperty(val); }

  @Input() fullAs:'window'|'content' = 'window';

  ngOnInit():void{
    this.onInit();
    this.__initPreheader();
  }
  
  private __initPreheader(){
    if(!this.current) return;
    this.configSvc.setElementHeight(this.current, this.elTag, this.height);
    if(this.height > 0) this.renderUtil.setHeight(this.height);
    else this.renderUtil.setStyle('height','fit-content');

    this.configSvc.setPreheaderDefaults(this.current, this.height,  this.fullHeight, this.fullWidth, this.useMaxWitdhForContent, this.fullAs);
  }

  override afterViewInit(){
    if(this.height === 0 && this.current){

      this.configSvc.setElementHeight(this.current, this.elTag, this.el.nativeElement.offsetHeight);
      console.log(this.el.nativeElement.offsetHeight)
    }
  }
}