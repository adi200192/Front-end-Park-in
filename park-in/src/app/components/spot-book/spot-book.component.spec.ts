import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatBookComponent } from './spot-book.component';

describe('SeatBookComponent', () => {
  let component: SeatBookComponent;
  let fixture: ComponentFixture<SeatBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
