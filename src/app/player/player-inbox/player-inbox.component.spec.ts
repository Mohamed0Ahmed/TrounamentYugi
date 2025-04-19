import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerInboxComponent } from './player-inbox.component';

describe('PlayerInboxComponent', () => {
  let component: PlayerInboxComponent;
  let fixture: ComponentFixture<PlayerInboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerInboxComponent]
    });
    fixture = TestBed.createComponent(PlayerInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
