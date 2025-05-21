import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolementComponent } from './enrolement.component';

describe('EnrolementComponent', () => {
  let component: EnrolementComponent;
  let fixture: ComponentFixture<EnrolementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrolementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnrolementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
