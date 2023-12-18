import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BnLayoutInfo, BnLayoutService } from '@binom/sdk-layout/core';
import { BnCssGridModule } from '@binom/sdk-layout/css-grid';


import { Subscription, take } from 'rxjs';


@Component({
  selector: 'app-inner',
  standalone: true,
  imports: [CommonModule,BnCssGridModule],
  templateUrl: './inner.component.html',
  styleUrl: './inner.component.scss'
})
export class InnerComponent implements OnInit,OnDestroy,AfterViewInit{
  authType: string = '';
  title: string = '';

  isSubmitting = false;

  validationList: any;
  regFinish = false;
  darkTheme: boolean = false;
  subscriptions: Array<Subscription> = new Array<Subscription>();
  layoutInfo!:BnLayoutInfo;
 
  
  constructor(
  
    private layoutSvc: BnLayoutService,

  ) {}

  private pwd: string = '';
  public pwdValid: boolean = false;

  ngAfterViewInit(): void { }
  
  displayName:string = '';
  email:string = '';

  ngOnInit(): void {
  
    

    this.subscriptions.push( this.layoutSvc.layoutInfo$.subscribe( (data: any) => this.__onLayoutChange(data) ) );
   
  }

  ngOnDestroy(){

     this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private __onLayoutChange(data:BnLayoutInfo){
    this.layoutInfo = data;

  }

 
}