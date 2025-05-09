import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantsProductComponent } from './plants-product.component';

describe('PlantsProductComponent', () => {
  let component: PlantsProductComponent;
  let fixture: ComponentFixture<PlantsProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantsProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantsProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
