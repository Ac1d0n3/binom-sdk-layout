import { Directive, ElementRef, Input, NgZone, Renderer2, inject } from '@angular/core';
import { BnLayoutService } from '@binom/sdk-layout/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BnGridInfo, BnGridWrapperEvent, BnLayoutGridService } from '@binom/sdk-layout/css-grid';

@Directive({
  selector: '[bnGridBlock]',
  standalone: true
})
export class BnGridBlockDirective {
  gridCols:string = '1fr';
  subscriptions: Array<Subscription> = new Array<Subscription>();
  layoutInfo:any;
  gridColsChache:number = 0;
  private layoutSvc = inject(BnLayoutService);
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);
  private gridSvc = inject(BnLayoutGridService);

  @Input() height:number = 0;
  @Input() width:string = 'auto';
  @Input() bottomMargin:number = 0;
  @Input() topMargin:number = 0;
  @Input() gridGap:number = 0;
  @Input() minColumnWidth:number= 200;


  @Input('columns') set setCoumns(value:number){
    this.gridColsChache = value;
    this.calc(this.gridColsChache);
  }

  width$ = new BehaviorSubject<number>(0);
  observer!:any;
  constructor( private zone: NgZone) {}
  
  gridRows:string = 'auto';
  isMobile:boolean = false;
  useWidth:number = 0;
  ngOnInit(): void {
    this.useWidth = this.el.nativeElement.offsetWidth;
    this.observer = new ResizeObserver(entries => {
      this.zone.run(() => {
        this.useWidth = entries[0].contentRect.width;
        this.calc(this.gridColsChache);
        this.updateView(); 
      });
    });

    this.observer.observe(this.el.nativeElement);

    if(this.height > 0) this.gridRows = this.height + 'px'
    this.calc(this.gridColsChache);
    this.updateView(); 
 

    this.subscriptions.push(this.gridSvc.wrapperEvent$.subscribe((data:BnGridWrapperEvent) => this.gridChange(data)));
  }


  calc(value:number){
    this.gridCols = '';
    
    if(value === 0){
      while( this.minColumnWidth * value <= this.useWidth){ value++; }
      value--
    } else {
      while( this.minColumnWidth * value >= this.useWidth ){ value--; }
      
    }
    for(let i = 0; i < value; i++){ this.gridCols += ' 1fr'; }
  }

  private gridChange(data:BnGridWrapperEvent){
    this.calc(this.gridColsChache);
    this.updateView(); 
  }

  updateView(){
      this.renderer.addClass(this.el.nativeElement, 'bn-grid-block')
      this.renderer.setStyle(this.el.nativeElement, 'width', this.width);
      this.renderer.setStyle(this.el.nativeElement, 'column-gap', this.gridGap+'px');
      this.renderer.setStyle(this.el.nativeElement, 'row-gap', this.gridGap+'px');
      this.renderer.setStyle(this.el.nativeElement, 'margin-top', this.topMargin+'px');
      this.renderer.setStyle(this.el.nativeElement, 'margin-bottom', this.bottomMargin+'px');
      this.renderer.setStyle(this.el.nativeElement, '-ms-grid-columns', this.gridCols);
      this.renderer.setStyle(this.el.nativeElement, 'grid-template-columns', this.gridCols);
      this.renderer.setStyle(this.el.nativeElement, 'grid-auto-rows', this.gridRows);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.observer.unobserve(this.el.nativeElement);
  }

}
