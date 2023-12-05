import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedNestedComponent } from './nested-nested.component';

describe('NestedNestedComponent', () => {
  let component: NestedNestedComponent;
  let fixture: ComponentFixture<NestedNestedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestedNestedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NestedNestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
