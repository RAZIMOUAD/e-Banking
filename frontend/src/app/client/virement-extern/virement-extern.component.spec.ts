import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirementExternComponent } from './virement-extern.component';

describe('VirementExternComponent', () => {
  let component: VirementExternComponent;
  let fixture: ComponentFixture<VirementExternComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirementExternComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VirementExternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
