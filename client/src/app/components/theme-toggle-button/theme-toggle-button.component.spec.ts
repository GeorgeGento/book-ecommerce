import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeToggleButtonComponent } from './theme-toggle-button.component';

describe('ThemeToggleButtonComponent', () => {
  let component: ThemeToggleButtonComponent;
  let fixture: ComponentFixture<ThemeToggleButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThemeToggleButtonComponent]
    });
    fixture = TestBed.createComponent(ThemeToggleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
