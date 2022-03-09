import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadExerciseComponent } from './load-exercise.component';

describe('LoadExerciseComponent', () => {
  let component: LoadExerciseComponent;
  let fixture: ComponentFixture<LoadExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadExerciseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
