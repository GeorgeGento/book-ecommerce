import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOrderModalComponent } from './add-edit-order-modal.component';

describe('AddEditOrderModalComponent', () => {
  let component: AddEditOrderModalComponent;
  let fixture: ComponentFixture<AddEditOrderModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditOrderModalComponent]
    });
    fixture = TestBed.createComponent(AddEditOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
