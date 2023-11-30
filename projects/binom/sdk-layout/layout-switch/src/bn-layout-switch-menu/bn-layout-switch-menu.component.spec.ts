import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnLayoutSwitchMenuComponent } from './bn-layout-switch-menu.component';

describe('BnLayoutSwitchMenuComponent', () => {
  let component: BnLayoutSwitchMenuComponent;
  let fixture: ComponentFixture<BnLayoutSwitchMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BnLayoutSwitchMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BnLayoutSwitchMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
