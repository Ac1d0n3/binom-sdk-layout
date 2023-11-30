import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnIconSidebarComponent } from './bn-icon-sidebar.component';

describe('BnIconSidebarComponent', () => {
  let component: BnIconSidebarComponent;
  let fixture: ComponentFixture<BnIconSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BnIconSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BnIconSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
