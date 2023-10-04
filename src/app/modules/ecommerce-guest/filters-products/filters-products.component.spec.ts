import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersProductsComponent } from './filters-products.component';

describe('FiltersProductsComponent', () => {
  let component: FiltersProductsComponent;
  let fixture: ComponentFixture<FiltersProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltersProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
