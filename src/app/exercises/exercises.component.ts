import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { LibraryService } from '../library.service';
import { Result } from '../result.model';
import { Score } from '../score.model';
import { Trainee } from '../trainee.model';
import { v4 as uuidv4 } from 'uuid';

declare const bootstrap: any;

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css']
})
export class ExercisesComponent implements OnInit, OnDestroy {
  @ViewChild('exerciseSection') exerciseSection!: ElementRef;

  duration: number = 5;
  private timeoutId?: ReturnType<typeof setTimeout>;
  private exerciseTimeout?: ReturnType<typeof setTimeout>;
  private timeout: number = this.duration * 60000 + 10000;
  private mouseDown: boolean = false;
  private timeoutMouse?: ReturnType<typeof setTimeout>;
  template: number = 0;
  private contentIsLoaded = false;
  private exercisesSub: Subscription = Subscription.EMPTY;
  private exercises: Exercise[] = [];
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
    legitimate: true,
    rightAnswer: {
      text: '',
      items: []
    },
    wrongAnswer: {
      text: '',
      items: []
    }
  };
  private y: number = 0;
  private numberOfClickedItems: number = 0;
  private lockClock = 0;
  private delay = 500;
  private currentExercise: number = 0;
  exercisesNumber: number = 0;
  private exerciseScore: number = 0;
  totalScore: number = 0;
  private sessionId: string = '';
  trainee: Trainee = {
    id: uuidv4(),
    name: ''
  };
  private isCorrect: boolean | null = null;
  private isPhishing: boolean | null = null;
  deploy = false;
  userRegistered: boolean = false;
  exerciseStarted: boolean = false;
  registerText: string = 'Please enter your name';
  registerButton: string = 'Register';
  username: string = '';
  endMessage = 'Sorry, the time is over';
  terminate: boolean = false;
  correctAnalysisNumber: number = 0;
  displayName: string = '';
  exerciseDisplayOne = true;
  exerciseDisplayTwo = false;

  constructor(private libraryService: LibraryService) { }

  ngOnInit(): void {
    this.libraryService.getExercises();
    this.exercisesSub = this.libraryService.getExercisesListener()
    .subscribe((exercises: Exercise[]) => {
        console.log("sub");
        this.exercises = this.shuffleArray(exercises);
        this.exercisesNumber = this.exercises.length;
        this.exercise = this.exercises[0];
    });
    this.libraryService.getSession().subscribe(response => {
      console.log(response.message);
      this.sessionId = response.sessionId;
      console.log('session: ' + this.sessionId);
    });
  }

  ngOnDestroy(): void {
    if (this.exercisesSub) {
      this.exercisesSub.unsubscribe();
    }
  }

  register() {
    this.registerText = 'Your name';
    this.registerButton = 'Change name';
    this.trainee.name = this.username.trim();
    this.userRegistered = true;
  }

  start() {
    this.exerciseStarted = true;
    this.libraryService.registerTrainee(this.trainee);
    this.exerciseSection.nativeElement.style.opacity = 1;
    const timeExpiration = () => this.displayStats();
    this.exerciseTimeout = setTimeout(timeExpiration, this.timeout);
  }

  private shuffleArray(array: Exercise[]) {
    let curId: number = array.length;
    while (0 !== curId) {
      const randId = Math.floor(Math.random() * curId);
      curId -= 1;
      const tmp = array[curId];
      array[curId] = array[randId];
      array[randId] = tmp;
    }
    return array;
  }

  private sendScore(data: { score: number, isCorrect: boolean | null }) {
    const result: Result = {
      exerciseId: this.exercise.id,
      exerciseTitle: this.exercise.title,
      traineeId: this.trainee.id,
      traineeName: this.trainee.name,
      sessionId: this.sessionId,
      score: data.score,
      isCorrect: data.isCorrect,
      isPhishing: this.isPhishing
    };
    this.libraryService.sendExerciseScore(result);
  }

  private displayStats() {
    console.log(this.totalScore);
    this.terminate = true;
    const stats: Score = {
      sessionId: this.sessionId,
      traineeId: this.trainee.id,
      traineeName: this.trainee.name,
      score: this.totalScore
    };
    this.libraryService.sendStats(stats);
  }

  goToNextPage(data: { score: number, isCorrect: boolean | null}) {
    ++this.currentExercise;
    this.totalScore += data.score;
    if (data.isCorrect) {
      ++this.correctAnalysisNumber;
    }
    this.sendScore(data);
    if (this.currentExercise < this.exercisesNumber) {
      const swapExercices = () => {
        this.exerciseDisplayOne = !this.exerciseDisplayOne;
        this.exerciseDisplayTwo = !this.exerciseDisplayTwo;
        this.exercise = this.exercises[this.currentExercise];
        this.exerciseSection.nativeElement.style.opacity = 1;
      }
      setTimeout(swapExercices, 500);
    } else {
      this.endMessage = 'You have done the exercises!';
      this.displayStats();
    }
  }
}
