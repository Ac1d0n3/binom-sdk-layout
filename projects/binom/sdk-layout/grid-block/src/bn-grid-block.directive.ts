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
  @Input() maxColumnWidth:number= 0;

  @Input('columns') set setCoumns(value:number){
    this.gridColsChache = value;
    this.calc(this.gridColsChache);
  }

  width$ = new BehaviorSubject<number>(0);
  observer!:any;
  constructor( private zone: NgZone) {}
  
  gridRows:string = 'auto';
  isMobile:boolean = false;
  ngOnInit(): void {
    this.observer = new ResizeObserver(entries => {
      this.zone.run(() => {
        this.width$.next(entries[0].contentRect.width);
        this.updateView();
      });
    });

    this.observer.observe(this.el.nativeElement);

    let sub1 = this.layoutSvc.layoutInfo$.subscribe((data:any)=>{
        this.layoutInfo = data;
        this.calc(this.gridColsChache);
        this.updateView();
    });
    if(this.height > 0) this.gridRows = this.height + 'px'
    this.updateView();
    this.subscriptions.push(sub1);

    this.subscriptions.push(this.gridSvc.wrapperEvent$.subscribe((data:BnGridWrapperEvent) => this.gridChange(data)));
  }


  calc(value:number){
    this.gridCols = '';
    if(value === 0){
      if(this.maxColumnWidth === 0 ) this.maxColumnWidth = this.minColumnWidth;
      while( this.maxColumnWidth * value < this.el.nativeElement.offsetWidth ){ value++; }
      value--
    } else {
      while( this.minColumnWidth * value >= this.el.nativeElement.offsetWidth ){ value--; }
    }
  
    for(let i = 0; i < value; i++){ this.gridCols += ' 1fr'; }
  
  }

  private gridChange(data:BnGridWrapperEvent){
    setTimeout(() => {
      this.calc(this.gridColsChache);
    this.updateView();
    },100);
    
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
