import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantAccessoriesComponent } from './plant-accessories.component';

describe('PlantAccessoriesComponent', () => {
  let component: PlantAccessoriesComponent;
  let fixture: ComponentFixture<PlantAccessoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantAccessoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantAccessoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
