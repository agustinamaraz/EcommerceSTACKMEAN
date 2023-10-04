import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcommerceAuthComponent } from './ecommerce-auth.component';

describe('EcommerceAuthComponent', () => {
  let component: EcommerceAuthComponent;
  let fixture: ComponentFixture<EcommerceAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcommerceAuthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcommerceAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
