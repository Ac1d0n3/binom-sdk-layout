
import { CommonModule } from '@angular/common';
import { Component,HostBinding,Input } from '@angular/core';
import { Subscription } from "rxjs";
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import { BnLayoutInfo, BnLayoutService } from '@binom/sdk-layout/core';
import { BnGridInfo, BnLayoutGridService } from '@binom/sdk-layout/css-grid';
import { BnLayoutSwitchComponent } from '../bn-layout-switch/bn-layout-switch.component';
import { BnDeviceIconComponent } from '../device-icon/device-icon.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'bn-layout-switch-menu',
  standalone: true,
  imports: [CommonModule, BnLayoutSwitchComponent, BnDeviceIconComponent, TranslateModule,MatMenuModule, MatTooltipModule, MatButtonModule],
  templateUrl: './bn-layout-switch-menu.component.html',
  styleUrl: './bn-layout-switch-menu.component.css'
})
export class BnLayoutSwitchMenuComponent {
  constructor(private translate: TranslateService) { }
  @HostBinding('class.button-component-fix') addClass: boolean = true;
  private  _onlyFirstWrapper:boolean = false;
  get onlyFirstWrapper(): boolean{ return this._onlyFirstWrapper; }
  @Input() set onlyFirstWrapper(val: BooleanInput) { this._onlyFirstWrapper = coerceBooleanProperty(val); }

  private  _allowGridSettings:boolean = false;
  get allowGridSettings(): boolean{ return this._allowGridSettings; }
  @Input() set allowGridSettings(val: BooleanInput) { this._allowGridSettings = coerceBooleanProperty(val); }

  private  _enableToolTips:boolean = false;
  get enableToolTips(): boolean{ return this._enableToolTips; }
  @Input() set enableToolTips(val: BooleanInput) { this._enableToolTips = coerceBooleanProperty(val); }

  private  _allowVisible:boolean = false;
  get allowVisible(): boolean{ return this._allowVisible; }
  @Input() set allowVisible(val: BooleanInput) { this._allowVisible = coerceBooleanProperty(val); }

  private  _allowFullscreen:boolean = true;
  get allowFullscreen(): boolean{ return this._allowFullscreen; }
  @Input() set allowFullscreen(val: BooleanInput) { this._allowFullscreen = coerceBooleanProperty(val); }

  @Input() allowedVisibleElements:string[] = ['preheader','sidebarleft','sidebarright','footer'];

  private  _allowCalcHeights:boolean = true;
  get allowCalcHeights(): boolean{ return this._allowCalcHeights; }
  @Input() set allowCalcHeights(val: BooleanInput) { this._allowCalcHeights = coerceBooleanProperty(val); }
}
