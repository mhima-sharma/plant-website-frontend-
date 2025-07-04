import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaliedPaymentComponent } from './falied-payment.component';

describe('FaliedPaymentComponent', () => {
  let component: FaliedPaymentComponent;
  let fixture: ComponentFixture<FaliedPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaliedPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaliedPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
