import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForbiddenCardsComponent } from './forbidden-cards.component';

describe('ForbiddenCardsComponent', () => {
  let component: ForbiddenCardsComponent;
  let fixture: ComponentFixture<ForbiddenCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForbiddenCardsComponent]
    });
    fixture = TestBed.createComponent(ForbiddenCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
