import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnSplitContentItemComponent } from './bn-split-content-item.component';

describe('BnSplitContentItemComponent', () => {
  let component: BnSplitContentItemComponent;
  let fixture: ComponentFixture<BnSplitContentItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BnSplitContentItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BnSplitContentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
