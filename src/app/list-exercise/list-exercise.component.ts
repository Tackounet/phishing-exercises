import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { LibraryService } from '../library.service';

declare const bootstrap: any;

@Component({
  selector: 'app-list-exercise',
  templateUrl: './list-exercise.component.html',
  styleUrls: ['./list-exercise.component.css']
})
export class ListExerciseComponent implements OnInit, OnDestroy {
  @ViewChild('main') main!: ElementRef;
  @ViewChild('urlText') urlText!: ElementRef;
  @ViewChild('blackScreenImage') blackScreenImage!: ElementRef;
  @ViewChild('urlBox') urlBox!: ElementRef;
  @ViewChild('answer') answer!: ElementRef;
  @ViewChild('response') response!: ElementRef;
  @ViewChild('statement') statement!: ElementRef;
  @ViewChild('buttons') buttons!: ElementRef;
  @ViewChild('btnLegitimate') btnLegitimate!: ElementRef;
  @ViewChild('btnSuspicious') btnSuspicious!: ElementRef;
  @ViewChild('btnNext') btnNext!: ElementRef;
  @ViewChild('btnValidate') btnValidate!: ElementRef;

  private timeoutId?: ReturnType<typeof setTimeout>;
  private exerciseTimeout?: ReturnType<typeof setTimeout>;
  private timeout: number = 30000;
  private mouseDown: boolean = false;
  private timeoutMouse?: ReturnType<typeof setTimeout>;
  private pointSuccessLegitimate: number = 10;
  private pointSuccessSuspicious: number = 10;
  private pointFailLegitimate: number = 0;
  private pointFailSuspicious: number = -10;
  template: number = 0;
  private contentIsLoaded = false;
  private exercisesSub: Subscription = Subscription.EMPTY;
  exercises: Exercise[] = [];
  private y: number = 0;
  private lockClock = 0;
  private currentExercise: number = 0;

  constructor(private libraryService: LibraryService) { }

  ngOnInit(): void {
    this.libraryService.getExercises();
    this.exercisesSub = this.libraryService.getExercisesListener().subscribe(exercises => {
      this.exercises = exercises;
    });
  }

  ngOnDestroy(): void {
    if (this.exercisesSub) {
      this.exercisesSub.unsubscribe();
    }
  }
}

