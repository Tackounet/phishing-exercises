import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
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
export class ExercisesComponent implements OnInit, OnDestroy, AfterViewChecked {
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
  @ViewChild('email') email!: ElementRef;
  @ViewChild('proposal') proposal!: ElementRef;

  duration: number = 5;
  private timeoutId?: ReturnType<typeof setTimeout>;
  private exerciseTimeout?: ReturnType<typeof setTimeout>;
  private timeout: number = this.duration * 60000 + 10000;
  private mouseDown: boolean = false;
  private timeoutMouse?: ReturnType<typeof setTimeout>;
  private pointSuccessLegitimate: number = 10;
  private pointSuccessSuspicious: number = 10;
  private pointFailLegitimate: number = 0;
  private pointFailSuspicious: number = -10;
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
  senderColor: string = this.generateHTMLColor();
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

  constructor(private libraryService: LibraryService) { }

  ngAfterViewChecked(): void {
    this.loadAllContent();
  }

  loadAllContent() {
    if (this.contentIsLoaded) { return; }
    if (!this.email) { return; }
    const loaded = this.email.nativeElement.querySelectorAll('#loaded');
    if (loaded.length > 0) {
      this.initBody(this);
      this.contentIsLoaded = true;
      loaded[0].remove();
      console.log('loaded');
      this.proposal.nativeElement.querySelectorAll('.proposal').forEach((e: HTMLElement) => {
        e.style.opacity = '0';
      });
    } else {
      console.log('not loaded');
    }
  }

  ngOnInit(): void {
    this.libraryService.getExercises();
    this.exercisesSub = this.libraryService.getExercisesListener()
    .subscribe((exercises: Exercise[]) => {
        console.log("sub");
        this.exercises = this.shuffleArray(exercises);
        this.exercisesNumber = this.exercises.length;
        this.setExercise(this);
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
    const timeExpiration = () => this.displayStats();
    this.exerciseTimeout = setTimeout(timeExpiration, this.timeout);
  }

  private setExercise(context: any) {
    context.exerciseScore = 0;
    context.exercise = context.exercises[context.currentExercise];
    console.log(context.exercise.body);
    context.template = parseInt(context.exercise.template);
    context.exercise.body = context.libraryService.render(context.exercise.body);
    context.exercise.object = context.libraryService.render(context.exercise.object);
    context.exercise.description = context.libraryService.render(context.exercise.description);
    context.exercise.toDisplayName = context.libraryService.render(context.exercise.toDisplayName);
    console.log(context.exercise);
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

  private sendScore() {
    const result: Result = {
      exerciseId: this.exercise.id,
      exerciseTitle: this.exercise.title,
      traineeId: this.trainee.id,
      traineeName: this.trainee.name,
      sessionId: this.sessionId,
      score: this.exerciseScore,
      isCorrect: this.isCorrect,
      isPhishing: this.isPhishing
    };
    this.libraryService.sendExerciseScore(result);
  }

  private onDeploy(d: Event, context: any) {
    console.log(d);
    console.log("deploy");
    // return;
    let e: HTMLElement | null | undefined = (d.target as HTMLElement);
    while (e?.getAttribute('fn') !== "deployable" && e?.className !== 'template') {
      console.log(e);
      e = e?.parentElement;
    }
    let classes = e.className.replaceAll(/ +/g, ' ').split(' ');
    console.log(context.email);
    const fold = context.email.nativeElement.querySelectorAll(".fold");
    const unfold = context.email.nativeElement.querySelectorAll(".unfold");
    if (classes.includes('deployed')) {
      classes = classes.filter(e => e !== 'deployed');
      e.className = classes.join(' ') + ' undeployed';
      fold.forEach((e: HTMLElement) => e.style.display = 'inline-block');
      unfold.forEach((e: HTMLElement) => e.style.display = 'none');
      console.log("fold");
    } else {
      classes = classes.filter(e => e !== 'undeployed');
      e.className = classes.join(' ') + ' deployed';
      fold.forEach((e: HTMLElement) => e.style.display = 'none');
      unfold.forEach((e: HTMLElement) => e.style.display = 'inline-block');
      console.log("unfold");
    }
    console.log("done");
  }

  private displayUrl(e: any, context: any) {
    let node = e;
    console.log('display');
    while (!node.getAttribute('data-bs-toggle') && node.className !== 'template') {
      console.log(node.className);
      node = node.parentElement;
    }
    context.urlText.nativeElement.innerText = node.getAttribute('bs-title');
    context.blackScreenImage.nativeElement.style.display = 'block';
    context.blackScreenImage.nativeElement.style.opacity = '1';
    context.urlBox.nativeElement.style.opacity = '1';
    if (context.urlBox.nativeElement.getAttribute('os') === 'ios') {
      context.urlBox.nativeElement.style.maxHeight = '992px';
    } else {
      context.urlBox.nativeElement.style.transition = 'max-height 0.2s ease-out';
      context.urlBox.nativeElement.style.maxHeight = context.urlBox.nativeElement.scrollHeight + "px";
    }
  }

  private clearUrl(context: any) {
    if (context.timeoutId) {
      clearTimeout(context.timeoutId);
    }
  }

  private showUrl(e: Event, context: any) {
    this.timeoutId = setTimeout(context.displayUrl, 500, e.target, context);
  }

  private initBody(context: any) {
    context.displayButtons('block');
    context.btnLegitimate.nativeElement.style.display = 'inline';
    context.btnSuspicious.nativeElement.style.display = 'inline';
    context.btnValidate.nativeElement.style.display = 'none';
    context.btnNext.nativeElement.style.display = 'none';
    context.answer.nativeElement.innerHTML = '';
    context.response.nativeElement.innerHTML = '';
    context.statement.nativeElement.style.height = '0px';
    context.response.nativeElement.opacity = 0;

    if (context.template !== 0) {
      context.email.nativeElement.querySelectorAll('[data-bs-toggle]').forEach((e: HTMLElement) => {
        const title = e.getAttribute('title');
        const t = title === null ? '' : title;
        e.setAttribute('bs-title', t);
        e.removeAttribute('title');
        e.addEventListener('mousedown', (e: Event) => context.showUrl(e, context));
        e.addEventListener('touchstart', (e: Event) => context.showUrl(e, context));
        e.addEventListener('mouseup', () => context.clearUrl(context));
        e.addEventListener('mouseleave', () => context.clearUrl(context));
        e.addEventListener('touchend', () => context.clearUrl(context));
        e.addEventListener('touchleave', () => context.clearUrl(context));
      });
      context.email.nativeElement.querySelectorAll('[fn="deployable"]').forEach((e: HTMLElement) => {
        e.addEventListener('mouseup', (e: Event) => context.onDeploy(e, context));
      });
    } else {
      const tooltipTriggerList = [].slice.call(context.email.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]'))
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
      });
    }

    context.main.nativeElement.style.opacity = 1;
    context.btnLegitimate.nativeElement.style.opacity = 1;
    context.btnSuspicious.nativeElement.style.opacity = 1;
  }

  private generateHTMLColor() {
    return '#' + (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6);
  }

  unloadScreen() {
    this.blackScreenImage.nativeElement.style.display = 'none';
    this.blackScreenImage.nativeElement.style.opacity = '0';
    this.urlBox.nativeElement.style.maxHeight = '';
    if (this.urlBox.nativeElement.getAttribute('os') === 'ios') {
      this.urlBox.nativeElement.style.opacity = '0';
    } else {
      this.urlBox.nativeElement.style.transition = 'none';
    }
  }

  private expandStatement(context: any) {
    const sectionHeight = context.statement.nativeElement.scrollHeight;
    context.statement.nativeElement.style.height = sectionHeight + 'px';

    const transition = () => {
      context.statement.nativeElement.removeEventListener('transitionend', transition);
      context.statement.nativeElement.style.height = null;
    };

    context.statement.nativeElement.addEventListener('transitionend', transition);
  }

  private collapseStatement() {
    let sectionHeight = this.statement.nativeElement.scrollHeight;
    let elementTransition = this.statement.nativeElement.style.transition;
    this.statement.nativeElement.style.transition = '';
    const that = this;

    requestAnimationFrame(function () {
      that.statement.nativeElement.style.height = sectionHeight + 'px';
      that.statement.nativeElement.style.transition = elementTransition;
      requestAnimationFrame(function () {
        that.statement.nativeElement.style.height = 0 + 'px';
        setTimeout(function () {
          ++that.y;
          that.main.nativeElement.querySelectorAll('[class*=show-]').forEach((e: HTMLElement) => e.classList.remove('hidden'));
          that.main.nativeElement.querySelectorAll('.show-' + that.y).forEach((e: HTMLElement) => e.classList.remove('hidden'));
          that.expandStatement(that);
        }, 200);
      });
    });
  }

  private rewriteStatement() {
    this.collapseStatement();
  }

  isLegitimate() {
    if (this.exercise.legitimate) {
      this.answer.nativeElement.innerHTML = this.exercise.rightAnswer.text;
      ++this.correctAnalysisNumber;
      this.isCorrect = true;
      this.isPhishing = false;
      this.exerciseScore = this.pointSuccessLegitimate;
      this.totalScore += this.exerciseScore;
      this.sendScore();
    } else {
      this.answer.nativeElement.innerHTML = this.exercise.wrongAnswer.text;
      this.isCorrect = false;
      this.isPhishing = true;
      this.exerciseScore = this.pointFailSuspicious;
      this.totalScore += this.exerciseScore;
      this.sendScore();
    }
    this.swapButtons(this.btnNext);
    this.rewriteStatement();
  }

  isSuspicious() {
    if (!this.exercise.legitimate) {
      this.swapButtons(this.btnValidate);
      this.answer.nativeElement.innerHTML = this.exercise.rightAnswer.text;
      this.exerciseScore += this.pointSuccessSuspicious;
      const that = this;
      this.email.nativeElement.querySelectorAll('.clickable').forEach((e: HTMLElement) => {
        e.style.cursor = 'pointer';
        e.addEventListener('mousedown', (e: Event) => {
          that.mouseDown = true;
          e.stopPropagation();
          that.timeoutMouse = setTimeout(() => that.mouseDown = false, 500, e);
        });
        e.addEventListener('mouseup', (e: Event) => {
          if (that.mouseDown) {
            that.mouseDown = false;
            window.clearTimeout(that.timeoutMouse);
            that.turnClick(e, that);
          }
        });
      });
      this.proposal.nativeElement.querySelectorAll('.proposal').forEach((e: HTMLElement) => {
        e.style.opacity = '1';
      });
      this.btnValidate.nativeElement.disabled = true;
    } else {
      this.answer.nativeElement.innerHTML = this.exercise.wrongAnswer.text;
      this.isCorrect = false;
      this.isPhishing = false;
      this.exerciseScore = this.pointFailLegitimate;
      this.totalScore += this.exerciseScore;
      this.sendScore();
      this.swapButtons(this.btnNext);
    }
    this.rewriteStatement();
  }

  toValidate() {
    this.swapButtons(this.btnNext);
    this.email.nativeElement.querySelectorAll('.clickable').forEach((e: HTMLElement) => {
      e.style.cursor = 'auto';
    });
    this.email.nativeElement.querySelectorAll('.clickable').forEach((e: HTMLElement) => {
      const new_element = e.cloneNode(true);
      e.parentNode?.replaceChild(new_element, e);
    });
    const allRightAnswers: any = {};
    const allWrongAnswers: any = {};
    if (this.exercise.rightAnswer.items) {
      this.exercise.rightAnswer.items.forEach(e => {
        if (e.id) {
          allRightAnswers[e.id] = e;
        }
      });
    }
    if (this.exercise.wrongAnswer.items) {
      this.exercise.wrongAnswer.items.forEach(e => {
        if (e.id) {
          allWrongAnswers[e.id] = e;
        }
      });
    }

    this.email.nativeElement.querySelectorAll('.clicked').forEach((e: HTMLElement) => {
      const attr: string | null = e.getAttribute('answer');
      const answer: string = attr === null ? '' : attr;
      const color = (answer in allRightAnswers) ? '#64f3b0' : '#ffa4a4';
      if (e.classList.contains('clickable')) {
        e.style.outline = color + ' solid 2px';
        e.style.backgroundColor = color;
      } else {
        Array.from(e.children).forEach(element => {
          e.style.backgroundColor = color;
        });
      }
    });
    const updateResponse = () => {
      this.response.nativeElement.innerHTML = this.writeResponse(allRightAnswers, allWrongAnswers);
      this.response.nativeElement.opacity = 1;
    }
    this.response.nativeElement.opacity = 0;
    setTimeout(updateResponse, 200);
    this.rewriteStatement();
  }

  writeResponse(allRightAnswers: any, allWrongAnswers: any) {
    const rightAnswers = [];
    const wrongAnswers = [];
    const allClickedElements = this.email.nativeElement.getElementsByClassName('clicked');

    let displayWrongAnswer = false;
    let displayDefaultWrongAnswer = false;

    for (let i = 0; i < allClickedElements.length; ++i) {
      const answer = allClickedElements[i].getAttribute('answer');
      const a: string = (answer === null) ? '' : answer;
      if (allRightAnswers[a]) {
        this.isCorrect = true;
        rightAnswers.push(allRightAnswers[a].text);
        this.exerciseScore += allRightAnswers[a].score;
      } else if (allWrongAnswers[a]) {
        wrongAnswers.push(allWrongAnswers[a].text);
        this.exerciseScore -= allWrongAnswers[a].score;
        displayWrongAnswer = true;
      } else {
        this.exerciseScore -= 5;
        displayDefaultWrongAnswer = true;
      }
    }

    let message = rightAnswers.length > 0 ? '<p><span style="color:#3c3">Correct' : '';
    for (let i = 0; i < rightAnswers.length; ++i) {
      if (i !== 0 && i === rightAnswers.length - 1) {
        message += ' and ' + rightAnswers[i];
      } else {
        message += ', ' + rightAnswers[i];
      }
    }

    if (displayWrongAnswer) {
      if (message !== '') {
        message +=
          '.</span> <span style="color:#f33">However';
      } else {
        message = '<p><span style="color:#f33">Sorry';
      }
      for (let i = 0; i < wrongAnswers.length; ++i) {
        if (i !== 0 && i === wrongAnswers.length - 1) {
          message += ' and ' + wrongAnswers[i];
        } else {
          message += ', ' + wrongAnswers[i];
        }
      }
    }

    if (displayDefaultWrongAnswer) {
      if (displayWrongAnswer) {
        message += '. The other elements you have selected are not suspicious enough'; // à revoir (Donald)
      } else {
        if (message !== '') {
          message += '.</span> <span style="color:#f33">However, the other elements you have selected are not suspicious enough'; // à revoir (Donald)
        } else {
          message = '<p><span style="color:#f33">Unfortunately, the elements you have selected does not raise enough suspiciousness'; // à revoir (Donald)
        }
      }
    }

    this.isPhishing = true;
    this.totalScore += this.exerciseScore;
    if (this.isCorrect) {
      ++this.correctAnalysisNumber;
    }
    this.sendScore();
    return message + '.</span></p>';
  }

  switchClick(e: Event) {
    this.turnClick(e, this);
  }

  turnClick(e: Event, context: any) {
    let element: HTMLElement | null | undefined = (e.target as HTMLElement);
    while (!element?.getAttribute('answer') && element?.className !== 'template') {
      element = element?.parentElement;
    }
    if (element.className === 'template') { return; }
    if (element.classList.contains('clicked')) {
      --context.numberOfClickedItems;
      console.log('remove answer: ' + element.getAttribute('answer'));
      console.log('remove: ' + element);
      element.classList.remove('clicked');
    } else {
      ++context.numberOfClickedItems;
      console.log('click answer: ' + element.getAttribute('answer'));
      console.log('click: ' + element);
      element.classList.add('clicked');
    }
    e.stopPropagation();
    context.btnValidate.nativeElement.disabled = context.numberOfClickedItems == 0;
  }

  private displayButtons(str: string) {
    this.buttons.nativeElement.style.display = str;
  }

  private swapButtons(btnRef: ElementRef) {
    const btn = this.buttons.nativeElement.querySelectorAll(".btn-nav");
    btn.forEach((e: HTMLElement) => e.style.opacity = '0');
    setTimeout(function () {
      btn.forEach((e: HTMLElement) => e.style.display = 'none');
      btnRef.nativeElement.style.display = 'inline';
      setTimeout(function () {
        btnRef.nativeElement.style.opacity = '1';
      }, 200);
    }, 200);
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

  goToNextPage() {
    if (this.lockClock < (Date.now() - this.delay)) {
      this.lockClock = Date.now();
      ++this.currentExercise;
      if (this.currentExercise < this.exercisesNumber) {
        this.main.nativeElement.style.opacity = 0;
        this.contentIsLoaded = false;
        const that = this;
        setTimeout(this.setExercise, 500, that);
      } else {
        this.endMessage = 'You have done the exercises!';
        this.displayStats();
      }
    }
  }
}

