import { Directive, Input } from '@angular/core';
import { BnLayoutElementBaseDirective } from '../shared/bn-layout-element-base.directive';
import { BnLogSource } from '@binom/sdk-core/logger';
import { BooleanInput, NumberInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';

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

  private _useMaxWitdhForContent: boolean = false; get useMaxWitdhForContent(): boolean { return this._useMaxWitdhForContent;}
  @Input() set useMaxWitdhForContent(val: BooleanInput) { this._useMaxWitdhForContent = coerceBooleanProperty(val); }

  private _height:number = 0;
  get height():number{ return this._height; }
  @Input() set height(val:NumberInput){ this._height= coerceNumberProperty(val); }


  ngOnInit():void{
    this.onInit();
    this.__initHeader();
    
  }

  private __initHeader(){
    if(!this.current) return
    this.configSvc.setHeaderDefaults(this.current, this.sticky,this.fullWidth,this.transparentAos,this.useMaxWitdhForContent);
    this.configSvc.setElementHeight(this.current, this.elTag, this.height);
    this.renderUtil.setHeight(this.height)
  }
  
}