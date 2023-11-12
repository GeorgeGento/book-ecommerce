import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartDialogListComponent } from './cart-dialog-list.component';

describe('CartDialogListComponent', () => {
  let component: CartDialogListComponent;
  let fixture: ComponentFixture<CartDialogListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartDialogListComponent]
    });
    fixture = TestBed.createComponent(CartDialogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
