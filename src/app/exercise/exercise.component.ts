import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { LibraryService } from '../library.service';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent implements OnInit, OnDestroy {
  template: number = 0;
  private exercisesSub: Subscription = Subscription.EMPTY;
  exercises: Exercise[] = [];
  exercise: Exercise = {
    id: '',
    template: 0,
    title: '',
    description: '',
    digram: '',
    object: '',
    senderDisplayName: '',
    senderEmail: '',
    time: '',
    toDisplayName: '',
    toEmail: '',
    body: '',
    rightAnswer: '',
    wrongAnswer: '',
    answers: null
  };

  constructor(private libraryService: LibraryService) { }

  ngOnInit(): void {
    this.libraryService.getExercises();
    this.exercisesSub = this.libraryService.getExercisesListener()
      .subscribe((exercises: Exercise[]) => {
        this.exercises = exercises;
        this.exercise = this.exercises[0];
      });
  }

  ngOnDestroy(): void {
    if (this.exercisesSub) {
      this.exercisesSub.unsubscribe();
    }
  }
}
