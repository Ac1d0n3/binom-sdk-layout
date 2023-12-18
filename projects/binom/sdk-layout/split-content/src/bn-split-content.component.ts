import { ChangeDetectorRef, Component, ContentChildren, ElementRef, Input, QueryList, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BnSplitContentItemDirective } from './bn-split-content-item.directive';
import { RendererUtils } from '@binom/sdk-core/utils';
import { BnLayoutInfo, BnLayoutService } from '@binom/sdk-layout/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'bn-split-content',
  standalone: true,
  imports: [CommonModule,BnSplitContentItemDirective],
  templateUrl: './bn-split-content.component.html',
  styleUrl: './bn-split-content.component.css'
})
export class BnSplitContentComponent {
  protected renderUtil: RendererUtils;
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
 
  private layoutSvc = inject(BnLayoutService);

  constructor() { 
    this.renderUtil = new RendererUtils(this.renderer, this.el);
  }

  private layoutSub!:Subscription;


  @ContentChildren(BnSplitContentItemDirective) items!: QueryList<BnSplitContentItemDirective>
  @Input() label:string = '';
  @Input() direction: 'horizontal'|'vertical' = 'vertical';
  @Input() minItemWidth: number = 200;

  layoutInfo!:BnLayoutInfo;

  ngAfterViewInit():void{
    this.layoutSub = this.layoutSvc.layoutInfo$.subscribe((data:BnLayoutInfo) => this.layoutChange(data));

    this.renderUtil.setStyle('display', 'grid');
    this.renderUtil.setStyle('margin-bottom', '10px');
    this.renderGrid();
  }

  private renderGrid(){
    let grid = '';


    if(this.el.nativeElement.offsetWidth < (this.items.length + 1) * this.minItemWidth){
      this.direction = 'horizontal';
    
    } else {this.direction = 'vertical'; }
      this.cdr.detectChanges();
    for(let i =0; i < this.items.length; i++){
      if(i>0)  grid += ' auto '
      grid += '1fr '
    }

    if(this.direction === 'vertical'){
      this.renderUtil.setStyle('grid-template-columns', grid);
      this.renderUtil.setStyle('grid-templayte-rows','auto')
    } else {
      this.renderUtil.setStyle('grid-template-columns', 'auto');
      this.renderUtil.setStyle('grid-templayte-rows', grid)
    }
 
  }

 private layoutChange(data:BnLayoutInfo){
    this.layoutInfo = data;
    this.renderGrid();
  }

  
  

  ngOnDestroy():void{
    this.layoutSub.unsubscribe();
  }

}
