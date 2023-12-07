import { Component } from '@angular/core';
import { BnLayoutService } from '@binom/sdk-layout/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'bn-layout-device-icon',
  template: '<i class="fas {{icon}}"></i>',
  standalone:true,
  imports:[]
})
export class BnDeviceIconComponent {
  constructor(
    private layoutSvc:  BnLayoutService,
  ) { }
  private subscriptions: Array<Subscription> = new Array<Subscription>();

  icon: string = 'fa-desktop' 
  ngOnInit():void{
    let sub1 = this.layoutSvc.layoutInfo$.subscribe((data:any)=>{
     
      if(data){
        if(data.device === 'phone') this.icon = 'fa-mobile-alt';
        else if(data.device === 'tablet')  this.icon = 'fa-tablet-alt';
        else  this.icon = 'fa-desktop'
      }
     
    
    });
    this.subscriptions.push(sub1);
  }

  ngOnDestroy(){ this.subscriptions.forEach(subscription => subscription.unsubscribe());}
}
