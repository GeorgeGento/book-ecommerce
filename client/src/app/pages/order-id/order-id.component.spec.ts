import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderIdComponent } from './order-id.component';

describe('OrderIdComponent', () => {
  let component: OrderIdComponent;
  let fixture: ComponentFixture<OrderIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderIdComponent]
    });
    fixture = TestBed.createComponent(OrderIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
