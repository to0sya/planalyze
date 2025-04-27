import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdTargetingComponent } from './ad-targeting.component';

describe('AdTargetingComponent', () => {
  let component: AdTargetingComponent;
  let fixture: ComponentFixture<AdTargetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdTargetingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdTargetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
