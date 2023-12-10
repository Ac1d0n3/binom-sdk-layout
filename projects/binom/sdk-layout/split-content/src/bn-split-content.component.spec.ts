import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnSplitContentComponent } from './bn-split-content.component';

describe('BnSplitContentComponent', () => {
  let component: BnSplitContentComponent;
  let fixture: ComponentFixture<BnSplitContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BnSplitContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BnSplitContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
