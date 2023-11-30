import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnLayoutSwitchComponent } from './bn-layout-switch.component';

describe('BnLayoutSwitchComponent', () => {
  let component: BnLayoutSwitchComponent;
  let fixture: ComponentFixture<BnLayoutSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BnLayoutSwitchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BnLayoutSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
